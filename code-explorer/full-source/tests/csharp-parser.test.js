import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCSharp, parseCSharpFiles } from '../src/features/diagram/parsers/csharp.js'
import { parseCSharp as parseOriginal } from './fixtures/class-diagram-csharp.original.js'
import { SAMPLE_CSHARP } from './fixtures/sample-csharp.js'

// ---------------------------------------------------------------------------
// 1. Đối chiếu với parser GỐC của class-diagram (golden master): kết quả parse không được đổi
// ---------------------------------------------------------------------------

/** Đưa kết quả mới về dạng của bản gốc: bỏ các trường thêm vào, id → tên (các mẫu đều có tên không trùng). */
function normalize(model) {
  const name = new Map(model.types.map((t) => [t.id, t.name]))
  const member = ({ path, line, ...m }) => m
  return {
    types: model.types.map(({ id, namespace, baseRefs, usings, path, line, locations, fields, methods, values, ...t }) => ({
      ...t, id: name.get(id), fields: fields.map(member), methods: methods.map(member), values: values.map(member),
    })),
    relations: model.relations.map((r) => ({ ...r, from: name.get(r.from), to: name.get(r.to), key: `${name.get(r.from)}|${name.get(r.to)}|${r.kind}` })),
  }
}
const stripBaseIds = (model) => ({ ...model, types: model.types.map(({ baseIds, ...t }) => t) })

const CORPUS = {
  'mẫu của class-diagram (CRLF, namespace Demo)': SAMPLE_CSHARP,
  'cửa hàng: kế thừa, interface, generic, record, struct, enum, collection': `using System;
using System.Collections.Generic;
namespace Shop.Models {
  /* comment { braces } và class Fake { } */
  public abstract class Entity : IEntity { public int Id { get; set; } protected abstract void Validate(); }
  public interface IEntity { int Id { get; } }
  public class Order : Entity, IComparable<Order> {
    private readonly List<OrderLine> _lines = new();
    public Customer Customer { get; set; }
    public string Note = "has { brace } and // not a comment";
    public decimal Total() { return 0; }
    public static Order Create(Customer c, int[] ids = null) => new Order();
    [Obsolete("x")] public void Old() { }
  }
  public class OrderLine { public Product Product; public int Qty; }
  public class Product { }
  public enum Status { New = 1, Paid, Shipped }
  public record Customer(string Name, int Age);
  public struct Point { public int X, Y; }
  public class Gen<T> where T : class, new() { T Value; }
}`,
  'chuỗi verbatim, ký tự, #region, comment lồng': `#region Header
public class A { string p = @"C:\\dir\\"; char c = '{'; string q = @"multi
line { x"; public B Next; /* } */ public void M() { var s = "}"; } }
#endregion
public class B : A { }`,
  'file-scoped namespace, kiểu lồng nhau, partial': `namespace Zoo;
public partial class Keeper { public Animal Pet; }
public partial class Keeper { public void Feed() { } }
public class Animal { public class Tail { } }`,
  'rác / rỗng': 'class { }}} public static ;;; namespace',
  rỗng: '',
}

for (const [label, source] of Object.entries(CORPUS)) {
  test(`golden master — ${label}`, () => {
    assert.deepEqual(normalize(parseCSharp(source)), stripBaseIds(parseOriginal(source)))
  })
}

// ---------------------------------------------------------------------------
// 2. Tính năng mới
// ---------------------------------------------------------------------------

test('id = tên đầy đủ có namespace; namespace lồng nhau và file-scoped đều nhận ra', () => {
  const r = parseCSharp('namespace A { namespace B.C { public class X {} } public class Y {} }')
  assert.deepEqual(r.types.map((t) => [t.id, t.name, t.namespace]), [['A.B.C.X', 'X', 'A.B.C'], ['A.Y', 'Y', 'A']])
  assert.deepEqual(parseCSharp('namespace Zoo;\npublic class Z {}').types.map((t) => t.id), ['Zoo.Z'])
  assert.deepEqual(parseCSharp('public class Global {}').types.map((t) => t.id), ['Global']) // không namespace: giữ tên đơn
})

test('hai class cùng tên ở hai namespace KHÔNG bị trộn (lỗi của bản gốc)', () => {
  const r = parseCSharp('namespace A { class User { int A1; } } namespace B { class User { int B1; } }')
  assert.equal(r.types.length, 2)
  assert.deepEqual(r.types.map((t) => t.id), ['A.User', 'B.User'])
  assert.deepEqual(r.types.map((t) => t.fields.map((f) => f.name)), [['A1'], ['B1']])
})

test('nối kiểu theo ngữ cảnh: cùng namespace → using → qualifier; mơ hồ thì bỏ qua', () => {
  const edges = (src) => parseCSharp(src).relations.map((r) => `${r.from}>${r.to}`).sort()
  const users = 'namespace A { class User {} } namespace B { class User {} }'
  assert.deepEqual(edges(`${users} namespace A { class SvcA { User u; } }`), ['A.SvcA>A.User']) // cùng namespace
  assert.deepEqual(edges(`${users} namespace C { using B; class SvcC { User u; } }`), ['C.SvcC>B.User']) // theo using
  assert.deepEqual(edges(`${users} namespace C { class SvcC { B.User u; } }`), ['C.SvcC>B.User']) // qualifier
  assert.deepEqual(edges(`${users} namespace C { class SvcC { User u; } }`), []) // mơ hồ → không vẽ quan hệ sai
  assert.deepEqual(edges('namespace A { class Base {} class Derived : Base {} }'), ['A.Derived>A.Base'])
})

const LINES = [
  'using System;', //                      1
  '', //                                   2
  '/* nhiều dòng', //                      3
  '   class Fake { } */', //               4
  'namespace Demo', //                     5
  '{', //                                  6
  '    #region Models', //                 7
  '    public class Animal', //            8
  '    {', //                              9
  '        public string Note = @"line1', // 10
  'line2 { brace";', //                    11  (chuỗi verbatim kéo qua 2 dòng)
  '        [Obsolete]', //                 12
  '        public void Speak() { }', //    13
  '        public int Age { get; set; }', // 14
  '    }', //                              15
  '    #endregion', //                     16
  '    public enum Color { Red, Green }', // 17
  '}', //                                  18
]

for (const [label, eol] of [['LF', '\n'], ['CRLF', '\r\n']]) {
  test(`số dòng đúng trong file GỐC dù có comment nhiều dòng, chuỗi verbatim, #region, attribute (${label})`, () => {
    const r = parseCSharp(LINES.join(eol))
    const animal = r.types.find((t) => t.name === 'Animal')
    assert.deepEqual(r.types.map((t) => t.name), ['Animal', 'Color']) // "class Fake" trong comment không phải kiểu
    assert.equal(animal.line, 8)
    assert.equal(r.types.find((t) => t.name === 'Color').line, 17)
    const at = (name) => [...animal.fields, ...animal.methods].find((m) => m.name === name).line
    assert.equal(at('Note'), 10)
    assert.equal(at('Speak'), 13) // dòng khai báo, sau dòng attribute [Obsolete]
    assert.equal(at('Age'), 14)
  })
}

test('nhiều file: class partial được gộp, mỗi thành viên nhớ file và dòng của nó', () => {
  const r = parseCSharpFiles([
    { path: 'src/Keeper.cs', text: 'namespace Zoo {\n  public partial class Keeper {\n    public Animal Pet;\n  }\n}' },
    { path: 'src/Keeper.Feed.cs', text: 'namespace Zoo {\n  public partial class Keeper {\n\n    public void Feed() { }\n  }\n}' },
    { path: 'src/Animal.cs', text: 'namespace Zoo { public class Animal { } }' },
  ])
  assert.deepEqual(r.types.map((t) => t.id), ['Zoo.Keeper', 'Zoo.Animal'])
  const keeper = r.types[0]
  assert.deepEqual(keeper.locations, [{ path: 'src/Keeper.cs', line: 2 }, { path: 'src/Keeper.Feed.cs', line: 2 }])
  assert.deepEqual([...keeper.fields, ...keeper.methods].map((m) => [m.name, m.path, m.line]), [['Pet', 'src/Keeper.cs', 3], ['Feed', 'src/Keeper.Feed.cs', 4]])
  assert.deepEqual(r.relations.map((x) => `${x.from}>${x.to}:${x.kind}`), ['Zoo.Keeper>Zoo.Animal:association']) // quan hệ xuyên file
})

test('using chỉ có tác dụng trong file chứa nó; không bao giờ ném lỗi với đầu vào xấu', () => {
  for (const bad of [null, undefined, 42, '{', 'class', 'namespace', 'class A : { ; } }', '"unterminated']) assert.doesNotThrow(() => parseCSharp(bad))
  assert.doesNotThrow(() => parseCSharpFiles([null, {}, { path: 'x', text: null }, { text: 'class Ok { }' }]))
  assert.equal(parseCSharpFiles([null, {}, { text: 'class Ok { }' }]).types.length, 1)
})

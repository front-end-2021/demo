import test from 'node:test'
import assert from 'node:assert/strict'
import { parseJava, parseJavaFiles } from '../src/features/diagram/parsers/java.js'
import { parseKotlin } from '../src/features/diagram/parsers/kotlin.js'
import { parsePythonFiles, moduleOf } from '../src/features/diagram/parsers/python.js'
import { parseFiles } from '../src/features/diagram/parsers/index.js'
import { autoLayout, estimateSize, routeEdges, segmentsCrossingBoxes } from '../src/features/diagram/layout.js'

const byId = (r) => Object.fromEntries(r.types.map((t) => [t.id, t]))
const members = (t) => [...t.fields, ...t.methods]
const rels = (r) => r.relations.map((x) => `${x.from.split('.').pop()}>${x.to.split('.').pop()}:${x.kind}`).sort()

// ===========================================================================
// JAVA
// ===========================================================================
const JAVA = [
  'package com.shop;', //                                                                    1
  'import java.util.*;', //                                                                  2
  'import com.shop.model.Customer;', //                                                      3
  '', //                                                                                     4
  '/** Doc { brace } */', //                                                                 5
  '@Entity', //                                                                              6
  'public abstract class Order extends Entity implements Comparable<Order>, Serializable {', // 7
  '    private static final String TAG = "a { b }";', //                                      8
  '    private final List<OrderLine> lines = new ArrayList<>();', //                          9
  '    protected Customer customer;', //                                                      10
  '    int a, b[];', //                                                                       11
  '    public Order(Customer c) { this.customer = c; }', //                                   12
  '    @Override', //                                                                         13
  '    public int compareTo(Order o) { return 0; }', //                                       14
  '    public abstract <T extends Comparable<T>> List<T> sorted(Collection<T> xs, final int n) throws Exception;', // 15
  '    public enum Status { NEW, PAID(1) { void f() {} }, SHIPPED; private int code; int code() { return code; } }', // 16
  '    static class Helper { }', //                                                           17
  '}', //                                                                                     18
  'interface Base { void run(); default void go() { } int MAX = 3; }', //                    19
  'record Point(int x, int y) implements Base { public void run() {} }', //                  20
  'class Entity { }', //                                                                     21
  'class OrderLine { }', //                                                                  22
].join('\n')
const JAVA_FILES = [
  { path: 'com/shop/Order.java', text: JAVA },
  { path: 'com/shop/model/Customer.java', text: 'package com.shop.model;\npublic class Customer { }' },
]

test('Java: id theo package, kiểu lồng nhau, loại kiểu, abstract', () => {
  const r = parseJavaFiles(JAVA_FILES)
  assert.deepEqual(r.types.map((t) => t.id), [
    'com.shop.Order', 'com.shop.Order.Status', 'com.shop.Order.Helper', 'com.shop.Base', 'com.shop.Point',
    'com.shop.Entity', 'com.shop.OrderLine', 'com.shop.model.Customer',
  ])
  const t = byId(r)
  assert.deepEqual(['com.shop.Order', 'com.shop.Order.Status', 'com.shop.Base', 'com.shop.Point'].map((id) => t[id].kind), ['class', 'enum', 'interface', 'record'])
  assert.equal(t['com.shop.Order'].abstract, true)
  assert.equal(t['com.shop.Order.Status'].namespace, 'com.shop.Order')
  assert.deepEqual(t['com.shop.Order'].bases, ['Entity', 'Comparable<Order>', 'Serializable'])
})

test('Java: thành viên — vis, static, abstract, mảng, nhiều biến một dòng, generic, throws', () => {
  const o = byId(parseJavaFiles(JAVA_FILES))['com.shop.Order']
  assert.deepEqual(o.fields.map((f) => `${f.vis}${f.static ? 'S' : ''} ${f.text}`), [
    '-S TAG: String', '- lines: List<OrderLine>', '# customer: Customer', '~ a: int', '~ b: int[]',
  ])
  assert.deepEqual(o.methods.map((m) => [m.kind, m.text, m.abstract]), [
    ['ctor', 'Order(Customer c)', false],
    ['method', 'int compareTo(Order o)', false],
    ['method', 'List<T> sorted(Collection<T> xs, int n)', true], // bỏ `final`, `throws`, tham số kiểu của phương thức
  ])
})

test('Java: enum (hằng số có thân + thành viên), interface (abstract / default / hằng), record', () => {
  const t = byId(parseJavaFiles(JAVA_FILES))
  const status = t['com.shop.Order.Status']
  assert.deepEqual(status.values.map((v) => v.name), ['NEW', 'PAID', 'SHIPPED'])
  assert.deepEqual(members(status).map((m) => m.text), ['code: int', 'int code()'])
  const base = t['com.shop.Base']
  assert.deepEqual(base.methods.map((m) => [m.name, m.abstract]), [['run', true], ['go', false]])
  assert.deepEqual(base.fields.map((f) => [f.name, f.static, f.vis]), [['MAX', true, '+']])
  assert.deepEqual(t['com.shop.Point'].fields.map((f) => f.text), ['x: int', 'y: int'])
})

test('Java: số dòng đúng (sau annotation, nhiều dòng)', () => {
  const t = byId(parseJavaFiles(JAVA_FILES))
  assert.deepEqual(['Order', 'Order.Status', 'Order.Helper', 'Base', 'Point', 'Entity', 'OrderLine'].map((n) => t[`com.shop.${n}`].line), [7, 16, 17, 19, 20, 21, 22])
  const line = (name) => members(t['com.shop.Order']).find((m) => m.name === name).line
  assert.deepEqual(['Order', 'compareTo', 'sorted', 'TAG', 'customer'].map(line), [12, 14, 15, 8, 10]) // compareTo: dòng khai báo, sau @Override
})

test('Java: quan hệ — extends, implements, kết hợp, tập hợp, theo import và cùng package', () => {
  assert.deepEqual(rels(parseJavaFiles(JAVA_FILES)), [
    'Order>Customer:association', // import com.shop.model.Customer
    'Order>Entity:generalization',
    'Order>OrderLine:aggregation', // List<OrderLine>
    'Point>Base:realization',
  ])
})

test('Java: bỏ qua lớp cục bộ và lớp ẩn danh; comment, chuỗi, ký tự không làm hỏng việc đếm ngoặc', () => {
  const r = parseJava('class A { void f() { class Local {} Runnable r = new Runnable() { public void run() {} }; String s = "}"; char c = \'{\'; } /* } */ int x; }')
  assert.deepEqual(r.types.map((t) => t.id), ['A'])
  assert.deepEqual(members(r.types[0]).map((m) => m.name), ['x', 'f']) // members() = trường rồi phương thức
})

test('Java: generic, @interface, hai class cùng tên khác package không bị trộn và mơ hồ thì không nối', () => {
  const g = parseJava('class Box<T extends Comparable<T>> { }\n@interface Marker { String value(); }')
  assert.deepEqual(g.types.map((t) => [t.display, t.kind]), [['Box<T extends Comparable<T>>', 'class'], ['Marker', 'interface']])
  const r = parseJavaFiles([
    { path: 'a/User.java', text: 'package a; class User { }' },
    { path: 'b/User.java', text: 'package b; class User { }' },
    { path: 'c/Svc.java', text: 'package c; class Svc { User u; }' },
    { path: 'a/Svc2.java', text: 'package a; class Svc2 { User u; }' },
  ])
  assert.equal(r.types.filter((t) => t.name === 'User').length, 2)
  assert.deepEqual(rels(r), ['Svc2>User:association']) // Svc (package c, không import) mơ hồ → không vẽ
})

// ===========================================================================
// KOTLIN  (không phải Java đổi đuôi file)
// ===========================================================================
const KT = [
  'package com.shop.model', //                                                             1
  '', //                                                                                   2
  'import com.shop.base.Entity', //                                                        3
  'import java.util.*', //                                                                 4
  '', //                                                                                   5
  '/** KDoc { } */', //                                                                    6
  '@Serializable', //                                                                      7
  'data class Order(', //                                                                  8
  '    val id: Long,', //                                                                   9
  '    private val customer: Customer,', //                                                10
  '    var lines: List<OrderLine> = emptyList(),', //                                       11
  '    note: String = "x ${1 + 2} { y }"', //                                               12
  ') : Base(), Comparable<Order> {', //                                                    13
  '    val total: Double get() = lines.sumOf { it.price }', //                              14
  '    lateinit var tag: String', //                                                        15
  '    private val repo = OrderRepository()', //                                            16
  '', //                                                                                    17
  '    fun addLine(line: OrderLine, qty: Int = 1): Boolean { return lines.add(line) }', //  18
  '    override fun compareTo(other: Order): Int = 0', //                                   19
  '    fun String.shout() = this', //                                                       20
  '    constructor(id: Long) : this(id, Customer(), emptyList(), "")', //                   21
  '', //                                                                                    22
  '    enum class Status { NEW, PAID(1) { override fun f() {} }, SHIPPED; fun label() = name }', // 23
  '    companion object { const val MAX = 10; fun create(): Order = TODO() }', //           24
  '}', //                                                                                   25
  '', //                                                                                   26
  'interface Entity { val id: Long; fun save() }', //                                      27
  'sealed class Shape', //                                                                 28
  'object Registry : Shape() { val items = mutableListOf<Order>() }', //                   29
  'abstract class Base<T : Comparable<T>> where T : Any { abstract fun run(): T }', //     30
  'class Customer', //                                                                     31
  'class OrderLine(val price: Double)', //                                                 32
  'class OrderRepository', //                                                              33
].join('\n')

test('Kotlin: loại kiểu — data class, interface, object, sealed, abstract, enum lồng nhau', () => {
  const r = parseKotlin(KT)
  assert.deepEqual(r.types.map((t) => t.id.replace('com.shop.model.', '')), ['Order', 'Order.Status', 'Entity', 'Shape', 'Registry', 'Base', 'Customer', 'OrderLine', 'OrderRepository'])
  const t = Object.fromEntries(r.types.map((x) => [x.id.replace('com.shop.model.', ''), x]))
  assert.deepEqual(['Order', 'Order.Status', 'Entity', 'Shape', 'Registry'].map((n) => t[n].kind), ['record', 'enum', 'interface', 'class', 'class'])
  assert.deepEqual(['Shape', 'Base', 'Customer'].map((n) => t[n].abstract), [true, true, false])
  assert.equal(t.Registry.static, true) // object = singleton
  assert.equal(t.Base.display, 'Base<T : Comparable<T>>')
})

test('Kotlin: constructor chính tự tạo thuộc tính (chỉ val / var), kiểu suy ra từ khởi tạo', () => {
  const o = Object.fromEntries(parseKotlin(KT).types.map((x) => [x.name, x])).Order
  assert.deepEqual(o.fields.map((f) => `${f.vis}${f.static ? 'S' : ''} ${f.text}`), [
    '+ id: Long', '- customer: Customer', '+ lines: List<OrderLine>', // `note` là tham số thường → KHÔNG phải thuộc tính
    '+ total: Double', // `get()` không dính vào kiểu
    '+ tag: String', '- repo: OrderRepository', // `private val repo = OrderRepository()`: kiểu suy ra từ khởi tạo, vis theo `private`
    '+S MAX', // companion object → static của lớp ngoài
  ])
})

test('Kotlin: hàm — tham số, kiểu trả về, hàm mở rộng, constructor phụ, companion', () => {
  const o = Object.fromEntries(parseKotlin(KT).types.map((x) => [x.name, x])).Order
  assert.deepEqual(o.methods.map((m) => `${m.static ? 'S' : ''}${m.kind}: ${m.text}`), [
    'ctor: Order(id: Long, customer: Customer, lines: List<OrderLine>, note: String)',
    'method: addLine(line: OrderLine, qty: Int): Boolean',
    'method: compareTo(other: Order): Int',
    'method: String.shout()',
    'ctor: Order(id: Long)',
    'Smethod: create(): Order', // `;` ngăn cách hai thành viên trên cùng một dòng
  ])
})

test('Kotlin: thành viên cách nhau bằng `;` trên một dòng, interface (abstract), enum, mutableListOf', () => {
  const t = Object.fromEntries(parseKotlin(KT).types.map((x) => [x.id.replace('com.shop.model.', ''), x]))
  assert.deepEqual(members(t.Entity).map((m) => [m.name, m.abstract]), [['id', true], ['save', true]])
  assert.deepEqual(t['Order.Status'].values.map((v) => v.name), ['NEW', 'PAID', 'SHIPPED'])
  assert.deepEqual(members(t['Order.Status']).map((m) => m.text), ['label()'])
  assert.deepEqual(t.Registry.fields.map((f) => f.text), ['items: List<Order>'])
  assert.equal(members(t.Base)[0].abstract, true)
})

test('Kotlin: số dòng đúng (sau annotation, header nhiều dòng)', () => {
  const t = Object.fromEntries(parseKotlin(KT).types.map((x) => [x.id.replace('com.shop.model.', ''), x]))
  assert.deepEqual(['Order', 'Order.Status', 'Entity', 'Shape', 'Registry', 'Base', 'Customer'].map((n) => t[n].line), [8, 23, 27, 28, 29, 30, 31])
  const line = (name) => members(t.Order).find((m) => m.name === name).line
  assert.deepEqual(['total', 'tag', 'addLine', 'compareTo', 'create'].map(line), [14, 15, 18, 19, 24])
})

test('Kotlin: quan hệ — supertype có gọi constructor là kế thừa, interface là thực thi, thuộc tính tạo quan hệ', () => {
  assert.deepEqual(rels(parseKotlin(KT)), [
    'Order>Base:generalization', // `: Base()`
    'Order>Customer:association',
    'Order>OrderLine:aggregation',
    'Order>OrderRepository:association',
    'Registry>Order:aggregation', // mutableListOf<Order>()
    'Registry>Shape:generalization',
  ])
  const impl = parseKotlin('interface I\nclass A : I\nclass B : A()')
  assert.deepEqual(rels(impl), ['A>I:realization', 'B>A:generalization'])
})

test('Kotlin: chuỗi mẫu `${…}` chứa dấu ngoặc, raw string, comment lồng nhau không làm hỏng việc cắt', () => {
  const r = parseKotlin('/* a /* b { */ c } */\nclass A {\n  val s = "v ${ f("}") } {"\n  val raw = """C:\\dir\\ { """\n  fun f() {}\n}\nclass B')
  assert.deepEqual(r.types.map((t) => t.id), ['A', 'B'])
  assert.deepEqual(members(r.types[0]).map((m) => m.name), ['s', 'raw', 'f'])
})

// ===========================================================================
// PYTHON
// ===========================================================================
const PY = [
  'from __future__ import annotations', //                                                  1
  'import abc', //                                                                          2
  'from dataclasses import dataclass, field', //                                            3
  'from typing import List, Optional, ClassVar', //                                         4
  'from enum import Enum', //                                                               5
  'from .base import Entity', //                                                            6
  '', //                                                                                    7
  'class Status(Enum):', //                                                                 8
  '    NEW = 1', //                                                                         9
  '    PAID = 2', //                                                                        10
  '', //                                                                                    11
  '@dataclass', //                                                                          12
  'class OrderLine:', //                                                                    13
  "    product: 'Product'", //                                                              14
  '    qty: int = 1', //                                                                    15
  '', //                                                                                    16
  'class Order(Entity, abc.ABC):', //                                                       17
  '    """Docstring with class Fake: and { braces }"""', //                                 18
  '    TAX: ClassVar[float] = 0.1', //                                                      19
  '    status = Status.NEW', //                                                             20
  "    def __init__(self, customer: 'Customer', lines: List[OrderLine] | None = None, note: str = 'x # y'):", // 21
  '        self.customer = customer', //                                                    22
  '        self._lines: List[OrderLine] = []', //                                           23
  '        self.__secret = Product()', //                                                   24
  '        self.note = note', //                                                            25
  '', //                                                                                    26
  '    @property', //                                                                       27
  '    def total(self) -> float:', //                                                       28
  '        return 0.0', //                                                                  29
  '', //                                                                                    30
  '    @total.setter', //                                                                   31
  '    def total(self, v): pass', //                                                        32
  '', //                                                                                    33
  '    @staticmethod', //                                                                   34
  "    def create(*args, **kw) -> 'Order':", //                                             35
  '        class Local: pass', //                                                          36
  '        return Order(None)', //                                                          37
  '', //                                                                                    38
  '    @abc.abstractmethod', //                                                             39
  '    def run(self, a: int, b=2) -> None: ...', //                                         40
  '', //                                                                                    41
  '    class Meta:', //                                                                     42
  "        ordering = ['id']", //                                                           43
  '', //                                                                                    44
  'class Product: pass', //                                                                45
].join('\n')
const PY_FILES = [
  { path: 'shop/models.py', text: PY },
  { path: 'shop/base.py', text: 'class Entity:\n    id: int\n' },
  { path: 'shop/customer.py', text: 'from .models import Order\nclass Customer(object):\n    def __init__(self):\n        self.orders: list[Order] = []\n' },
]

test('Python: module suy ra từ đường dẫn', () => {
  assert.equal(moduleOf('shop/models.py'), 'shop.models')
  assert.equal(moduleOf('shop/__init__.py'), 'shop')
  assert.equal(moduleOf('main.py'), 'main')
  assert.equal(moduleOf(''), '')
  assert.equal(moduleOf('a\\b\\c.py'), 'a.b.c')
})

test('Python: loại kiểu — Enum, @dataclass, ABC; class lồng nhau; class cục bộ trong hàm bị bỏ qua', () => {
  const r = parsePythonFiles(PY_FILES)
  assert.deepEqual(r.types.map((t) => t.id), ['shop.models.Status', 'shop.models.OrderLine', 'shop.models.Order', 'shop.models.Order.Meta', 'shop.models.Product', 'shop.base.Entity', 'shop.customer.Customer'])
  const t = byId(r)
  assert.deepEqual(['Status', 'OrderLine', 'Order', 'Product'].map((n) => t[`shop.models.${n}`].kind), ['enum', 'record', 'class', 'class'])
  assert.equal(t['shop.models.Order'].abstract, true) // ABC + @abstractmethod
  assert.deepEqual(t['shop.models.Order'].bases, ['Entity', 'abc.ABC'])
  assert.deepEqual(t['shop.models.Status'].values.map((v) => v.name), ['NEW', 'PAID'])
})

test('Python: thuộc tính — annotation, ClassVar, thuộc tính trong __init__ (kiểu từ tham số / khởi tạo), @property', () => {
  const o = byId(parsePythonFiles(PY_FILES))['shop.models.Order']
  assert.deepEqual(o.fields.map((f) => `${f.vis}${f.static ? 'S' : ''} ${f.text}`), [
    '+S TAX: ClassVar[float]', '+S status', // gán ở cấp lớp = thuộc tính lớp
    '+ customer: Customer', // kiểu lấy từ annotation của tham số cùng tên (forward ref 'Customer' đã bỏ dấu nháy)
    '# _lines: List[OrderLine]', '- __secret: Product', // `Product()` → suy ra kiểu; tên `_x` / `__x` quyết định vis
    '+ note: str', '+ total: float', // @property → thuộc tính
  ])
  const line = byId(parsePythonFiles(PY_FILES))['shop.models.OrderLine']
  assert.deepEqual(line.fields.map((f) => `${f.static ? 'S' : ''}${f.text}`), ['product: Product', 'qty: int']) // dataclass: trường annotation là thuộc tính thể hiện
})

test('Python: phương thức — bỏ self/cls, decorator, setter trùng tên bị bỏ, docstring không bị nhầm là mã', () => {
  const o = byId(parsePythonFiles(PY_FILES))['shop.models.Order']
  assert.deepEqual(o.methods.map((m) => `${m.static ? 'S' : ''}${m.abstract ? 'A' : ''}${m.kind}: ${m.text}`), [
    'ctor: __init__(customer: Customer, lines: List[OrderLine] | None, note: str)', // `'x # y'` không bị coi là comment
    'Smethod: create(*args, **kw) -> Order',
    'Amethod: run(a: int, b)', // `-> None` không hiện
  ])
  assert.ok(!members(o).some((m) => m.name === 'Fake'))
})

test('Python: số dòng đúng', () => {
  const t = byId(parsePythonFiles(PY_FILES))
  assert.deepEqual(['Status', 'OrderLine', 'Order', 'Order.Meta', 'Product'].map((n) => t[`shop.models.${n}`].line), [8, 13, 17, 42, 45])
  const line = (name) => members(t['shop.models.Order']).find((m) => m.name === name).line
  assert.deepEqual(['TAX', 'status', '__init__', 'customer', 'total', 'create', 'run'].map(line), [19, 20, 21, 22, 28, 35, 40])
})

test('Python: quan hệ — import tương đối giữa module, forward ref, collection, class lồng', () => {
  assert.deepEqual(rels(parsePythonFiles(PY_FILES)), [
    'Customer>Order:aggregation', // list[Order] + `from .models import Order`
    'Order>Customer:association', // customer: 'Customer' (module khác, không import → duy nhất trong tập)
    'Order>Entity:generalization', // `from .base import Entity`
    'Order>OrderLine:aggregation', // _lines: List[OrderLine]
    'Order>Product:association',
    'OrderLine>Product:association', // product: 'Product'
  ])
})

test('Python: Protocol → interface; hai class cùng tên ở hai module → mơ hồ thì không nối, có import thì nối', () => {
  const r = parsePythonFiles([
    { path: 'a.py', text: 'from typing import Protocol\nclass Port(Protocol):\n    def send(self) -> None: ...\nclass User: pass\n' },
    { path: 'b.py', text: 'class User: pass\n' },
    { path: 'c.py', text: 'from a import Port\nclass Impl(Port):\n    u: User\n' },
    { path: 'd.py', text: 'from b import User\nclass Svc:\n    u: User\n' },
  ])
  assert.equal(byId(r)['a.Port'].kind, 'interface')
  assert.deepEqual(rels(r), ['Impl>Port:realization', 'Svc>User:association']) // Impl.u: User → mơ hồ (a.User / b.User, không import) → bỏ
})

test('Python: đầu vào xấu không ném lỗi; thụt lề bằng tab và class một dòng', () => {
  for (const bad of [null, undefined, 42, 'class', 'class :', 'class A(', 'def f(', '"""unterminated', 'class A:\n\t\t\tx']) assert.doesNotThrow(() => parsePythonFiles([{ path: 'x.py', text: bad }]))
  const r = parsePythonFiles([{ path: 'x.py', text: 'class A:\n\tx: int = 1\n\tdef f(self): pass\nclass B: pass' }])
  assert.deepEqual(r.types.map((t) => t.id), ['x.A', 'x.B'])
  assert.deepEqual(members(r.types[0]).map((m) => m.name), ['x', 'f'])
})

// ===========================================================================
// DÙNG CHUNG
// ===========================================================================
test('nhiều ngôn ngữ trong một sơ đồ: parse riêng từng ngôn ngữ, quan hệ chỉ nối trong cùng ngôn ngữ', () => {
  const r = parseFiles([
    { path: 'A.java', text: 'class User { }\nclass JSvc { User u; }' },
    { path: 'B.kt', text: 'class User\nclass KSvc(val u: User)' },
    { path: 'c.py', text: 'class User: pass\nclass PSvc:\n    u: User\n' },
    { path: 'D.cs', text: 'class User { }\nclass CSvc { User u; }' },
    { path: 'e.rb', text: '' },
  ])
  assert.equal(r.types.filter((t) => t.name === 'User').length, 4)
  assert.deepEqual(rels(r), ['CSvc>User:association', 'JSvc>User:association', 'KSvc>User:association', 'PSvc>User:association'])
  assert.deepEqual(r.relations.map((x) => x.from).sort(), ['CSvc', 'JSvc', 'KSvc', 'c.PSvc'])
  assert.deepEqual(r.unsupported, ['e.rb'])
})

test('mọi ngôn ngữ: autoLayout xếp tầng và routeEdges không xuyên qua ô class', () => {
  for (const [label, r] of [['Java', parseJavaFiles(JAVA_FILES)], ['Kotlin', parseKotlin(KT)], ['Python', parsePythonFiles(PY_FILES)]]) {
    const layout = autoLayout(r, estimateSize)
    const boxes = Object.fromEntries(r.types.map((t) => [t.id, { ...layout[t.id], ...estimateSize(t) }]))
    assert.ok(r.types.every((t) => Number.isFinite(layout[t.id]?.x) && Number.isFinite(layout[t.id]?.y)), label)
    const edges = routeEdges(r.relations, boxes)
    assert.equal(edges.length, r.relations.length, label)
    for (const e of edges) assert.deepEqual(segmentsCrossingBoxes(e.points, boxes), [], `${label}: ${e.key}`)
    for (const rel of r.relations.filter((x) => x.kind === 'generalization' || x.kind === 'realization')) assert.ok(layout[rel.to].y < layout[rel.from].y, `${label}: ${rel.to} phải nằm trên ${rel.from}`)
  }
})

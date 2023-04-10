import { _keyListMain, getValue } from "./localData";
import { getListMain, getListSubActionWith } from "./localData";
import { getDateAfterDaysString } from "../global";
import { v4 as uuidv4 } from 'uuid';

const idMs = [uuidv4(), uuidv4()];
const dataM = [
    {
        Id: idMs[0],
        Name: 'Welcome to Planning',
        Description: `✔ Add new first goal\n✔ Add new Subgoal\n✔ Edit exist goal`,
    },
    {
        Id: idMs[1],
        Name: 'React hooks',
        Description: `<a href="https://react.dev/reference/react">Hooks</a> are a new addition in React 16.8. They let you use state and other React features without writing a class.
Starting with 16.8.0, React includes a stable implementation of React Hooks for:\n<ul>
<li>React DOM</li><li>React Native</li><li>React DOM Server</li><li>React Test Renderer</li><li>React Shallow Renderer</li>
</ul>\nNote that <b>to enable Hooks, all React packages need to be 16.8.0 or higher</b>. Hooks won’t work if you forget to update, for example, React DOM.
<a href="https://reactnative.dev/blog/2019/03/12/releasing-react-native-059">React Native 0.59</a> and above support Hooks.`
    }
];
const idSs = [uuidv4(), uuidv4(), uuidv4()];
const dataS = [
    {
        ParentId: idMs[0],
        Id: idSs[0],
        Name: 'Overview',
        Description: `Two major aspects of web performance:\n✔ Page Load Performance\n✔ Update Performance`,
    },
    {
        ParentId: idMs[1],
        Id: idSs[1],
        Name: 'Built-in React Hooks',
        Description: `State Hooks\nContext Hooks\nRef Hooks\nEffect Hooks\nPerformance Hooks\nOther Hooks ...`,
    },
    {
        ParentId: idMs[1],
        Id: idSs[2],
        Name: 'Your own Hooks',
        Description: `You can also <a href="https://react.dev/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component">define your own custom Hooks</a> as JavaScript functions.`,
    },
];
const dataA = [
    {
        ParentId: idSs[0],
        Id: uuidv4(),
        Name: 'Page Load Performance',
        Description: `How <u>fast the application</u> shows content and becomes interactive on the initial visit. This is usually measured using web vital metrics like&nbsp;<a href="https://web.dev/lcp/">Largest Contentful Paint (LCP)</a>&nbsp;and&nbsp;<a href="https://web.dev/fid/">First Input Delay (FID)</a>.`
    },
    {
        ParentId: idSs[0],
        Id: uuidv4(),
        Name: 'Update Performance', 
        Start: getDateAfterDaysString(-1),
        End: getDateAfterDaysString(1),
        Description: `How fast the application updates in response to user input. For example, how fast a list updates when the user types in a search box, or how fast the page switches when the user clicks a navigation link in a <b>Single-Page Application (SPA)</b>.`
    },
    {
        ParentId: idSs[0],
        Id: uuidv4(),
        Name: 'Promotion Picture', Start: getDateAfterDaysString(0),
        Description: `<img src="https://raw.githubusercontent.com/front-end-2021/demo/main/marketing-react/present.jpg" alt="promotion"/>`
    },
    {
        ParentId: idSs[0],
        Id: uuidv4(),
        Name: 'Demo Img Picture', End: "Apr 09 2023",
        Description: `<img src="https://i.pinimg.com/236x/e5/a3/6e/e5a36ef565d8c5a3c8ffcbb600c59c61.jpg" alt="demo picture"/>`
    },
    {
        ParentId: idSs[0],
        Id: uuidv4(),
        Name: 'Source code',
        Description: `<a href="https://github.com/front-end-2021/demo/tree/main/marketing-react" target="_blank">Github/front-end-2021/demo</a>`
    },
    {
        ParentId: idSs[1],
        Id: uuidv4(),
        Name: 'State Hooks',
        Description: `State lets a component <a href="https://react.dev/learn/state-a-components-memory">“remember” information like user input</a><br>\nuseState<br>useReducer<br>\nfunction ImageGallery() {\n&nbsp; const [index, setIndex] = useState(0);\n&nbsp; // ...`
    },
    {
        ParentId: idSs[1],
        Id: uuidv4(),
        Name: 'Context Hooks',
        Description: `Context lets a component <a href="https://react.dev/learn/passing-props-to-a-component">receive information from distant parents without passing it as props</a><br>\nuseContext<br><br>function Button() {\n&nbsp; const theme = useContext(ThemeContext);\n&nbsp; // ...`
    },
    {
        ParentId: idSs[1],
        Id: uuidv4(),
        Name: 'Effect Hooks',
        Description: `Effects let a component <a href="https://react.dev/learn/synchronizing-with-effects">connect to and synchronize with external systems</a>.<br><br>function ChatRoom({ roomId }) {<br>&nbsp; useEffect(() =&gt; {<br>&nbsp; &nbsp; const connection = createConnection(roomId);<br>&nbsp; &nbsp; connection.connect();<br>&nbsp; &nbsp; return () =&gt; connection.disconnect();<br>&nbsp; }, [roomId]);<br>&nbsp; // ...`
    },
    {
        ParentId: idSs[1],
        Id: uuidv4(),
        Name: 'Ref Hooks',
        Description: `Refs let a component <a href="https://react.dev/learn/referencing-values-with-refs">hold some information that isn’t used for rendering</a><br><br>useRef<br>useImperativeHandle<br><br>function Form() {<br>&nbsp; const inputRef = useRef(null);<br>&nbsp; // ...`
    },
    {
        ParentId: idSs[1],
        Id: uuidv4(),
        Name: 'Performance Hooks',
        Description: `A common way to optimize re-rendering performance is to skip unnecessary work.<br><br>useMemo<br>useCallback<br><br>function TodoList({ todos, tab, theme }) {<br>&nbsp; const visibleTodos = useMemo(() =&gt; filterTodos(todos, tab), [todos, tab]);<br>&nbsp; // ...`
    },
    {
        ParentId: idSs[1],
        Id: uuidv4(),
        Name: 'Other Hooks',
        Description: `useDebugValue<br>useId<br>useSyncExternalStore`
    },
]

export const IsView = !Array.isArray(getValue(_keyListMain))
export function getDemoData() {
    if (Array.isArray(getValue(_keyListMain))) {
        return {
            getListMain, getListSubActionWith
        }
    }
    return {
        getListMain: function () {
            return dataM.map(x => {
                return Object.assign({
                    IsDone: false, IsExpand: true, Budget: 10
                }, x)
            })
        },
        getListSubActionWith: function (apiPath, params) {
            const { mainid, subid } = params
            switch (apiPath) {
                case 'subs':
                    return dataS.filter(x => x.ParentId === mainid).map(x => {
                        return Object.assign({
                            IsDone: false, IsExpand: true, Budget: 12
                        }, x)
                    })
                case 'actions':
                    return dataA.filter(x => x.ParentId === subid).map((x, i) => {
                        return Object.assign({
                            IsDone: i === 0, IsExpand: true,
                            ExpectCost: i + 1, TrueCost: i > 3 ? i + 3 : i
                        }, x);
                    })
                default:
                    return []
            }
        },
        IsView: IsView
    }
}
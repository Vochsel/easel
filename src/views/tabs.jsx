import { createSignal, For } from "solid-js";

const Tabs = (props) => {
    const [tabIndex, setTabIndex] = createSignal(0);

    return <div>
        <div id='tabNames'>
            <For each={props.tabNames}>
                {(name, index) => <span className="tabButton" onClick={() => setTabIndex(index)}>{name}</span>}
            </For>
        </div>
        <div id='tabs'>
            <For each={props.tabs}>
                {(tab, index) => <div className="tab" style={{ display: index() === tabIndex() ? "block" : "none" }}>{tab}</div>}
            </For>
        </div>
    </div>
}

export { Tabs };
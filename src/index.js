import React, { useState } from 'react';
//import ReactDOM from "react-dom";
import ReactDOM from 'react-dom/client';
import './css/styles.css';

const cardData = [];

function FilterBlock({cardList, setCardList}) {
    const [btnsActive, setBtnsActive] = useState([
        true, false, false, false
    ]);

    function filterCards(status) {
        switch(status) {
            case 'all':
                setBtnsActive([true, false, false, false]);
                break;
            case 'frozen':
                setBtnsActive([false, true, false, false]);
                break;
            case 'completed':
                setBtnsActive([false, false, true, false]);
                break;
            case 'added':
                setBtnsActive([false, false, false, true]);
                break;
        };

        const manageCardList = [...cardList];

        if (status === 'all') {
            manageCardList.forEach(item => {
                item.show = true;
            });
        } else {
            manageCardList.forEach(item => {
                if (item.status === status) { item.show = true; }
                else { item.show = false; };
            });
        };
        setCardList(manageCardList);
    };

    const allAddit = btnsActive[0] ? 'button_filterAllActive' : '';
    const blueAddit = btnsActive[1] ? 'button_filterBlueActive' : '';
    const greenAddit = btnsActive[2] ? 'button_filterGreenActive' : '';
    const redAddit = btnsActive[3] ? 'button_filterRedActive' : '';

    return (<>
        <div className="sectionTitle">– Фильтровать:</div>
        <Button className={'buttonFilter button_filterAll ' + allAddit} onClick={() => filterCards('all')} content="Все"/>
        <Button className={'buttonFilter button_filterBlue ' + blueAddit} onClick={() => filterCards('frozen')} content="Отложенные"/>
        <Button className={'buttonFilter button_filterGreen ' + greenAddit} onClick={() => filterCards('completed')} content="Выполненные"/>
        <Button className={'buttonFilter button_filterRed ' + redAddit} onClick={() => filterCards('added')} content="Не выполненные"/>
    </>);
};

function EditBlock({showSidebar, setShowSidebar, cardList, setCardList, curKey}) {
    const [value, setValue] = useState('');
    let displaytext = '';
    const manageCardList = [...cardList];
    const text = manageCardList.find((i, index) => index === curKey);
    if (text) displaytext = text.content;

    const save = () => {
        if (text && value !== '') {
            text.content = value;
            setCardList(manageCardList);
            setValue('');
        };
    };

    const deleteC = () => {
        manageCardList.splice(curKey, 1);
        setCardList(manageCardList);
        setShowSidebar(false);
    };

    const closeSidebar = () => {
        setShowSidebar(false);
        setValue('');
    };

    return(
        <div id="editBlock" className={showSidebar ? 'show' : ''}>
            <Button className="sophBlackButton" onClick={() => closeSidebar()} content="X"/>
            <div className="sidebar-header">Текст задачи:</div>
            <div id="displayText">{displaytext}</div>
            <div className="sidebar-header">Новый текст задачи:</div>
            <TextField value={value} onChange={e => setValue(e.target.value)}/>
            <div className="sidebar-buttons">
                <Button className="sophBlackButton sidebar-save-btn" onClick={() => save()} content="Сохранить"/>
                <Button className="sophBlackButton sidebar-delete-btn" onClick={() => deleteC()} content="Удалить"/>
            </div>
        </div>
    );
};

function AddCardForm({addCard}) {
    const[content, setContent] = useState('');

    return(<>
        <div className="sectionTitle">– Добавить задачу:</div>
        <input className='newTaskInput' type="text" placeholder="Текст новой задачи" value={content} onChange={e => setContent(e.target.value)} />
        <Button className="sophBlackButton" onClick={() => addCard(content)} content="Добавить" />
    </>);
};

function TextField(props) {
    return(
        <input value={props.value} onChange={props.onChange} />
    );
};

function Button(props) {
    return(
        <button className={props.className} onClick={props.onClick}>{props.content}</button>
    );
};

function Card({className, singleCard, singleCardKey, editStatus, editCard}) {
    let statusClass = 'cardStatus';
    switch (singleCard.status) {
        case 'completed':
            statusClass += ' cardStatusGreen';
            break;
        case 'added':
            statusClass += ' cardStatusRed';
            break;
        case 'frozen':
            statusClass += ' cardStatusBlue';
            break;
    };

    return(
        <div className={'card ' + className} onClick={(e) => {if (!e.target.classList.contains('cardStatus')) editCard(singleCardKey)}}>
            <div className={statusClass} onClick={() => editStatus(singleCardKey)}></div>
            <div id="editableDiv" className="cardContent">{singleCard.content}</div>
        </div>
    );
};

function Cards() {
    const [cardList, setCardList] = useState(cardData);

    const editStatus = (key) => {
        const arr = [...cardList];
        const cur = arr.find((i, index) => index === key);
        if (cur.status === 'added') { cur.status = 'completed'; }
        else if (cur.status === 'completed') { cur.status = 'frozen'; }
        else if (cur.status === 'frozen') { cur.status = 'added'; };
        setCardList(arr);
    };

    const addCard = (content) => {
        if (content === '') return;
        setCardList([
            {
                content,
                status: 'added',
                show: true
            },
            ...cardList
        ]);
    };

    const [showSidebar, setShowSidebar] = useState(false);
    const [curKey, setCurKey] = useState(null);

    const editCard = (key) => {
        setShowSidebar(true);
        setCurKey(key);
    };

    return (<>
        <AddCardForm addCard={addCard}/>
        <FilterBlock cardList={cardList} setCardList={setCardList}/>
        <div className="cards">
        {cardList.map((item, index) => (
            <Card className={item.show ? '' : 'hidden'} singleCard={item} singleCardKey={index} key={index} editStatus={editStatus} editCard={editCard}/>
        ))}
        </div>
        <EditBlock showSidebar={showSidebar} setShowSidebar={setShowSidebar} cardList={cardList} setCardList={setCardList} curKey={curKey} />
    </>);
};

function App() {
    return (
      <div className='App'>
        <h2>Todo на React</h2>
        <Cards />
      </div>
    );
};

//ReactDOM.render(<App />, document.querySelector('#root'));
ReactDOM.createRoot(document.querySelector('#root')).render(<App />);
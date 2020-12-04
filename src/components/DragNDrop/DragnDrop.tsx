/* eslint-disable max-len */
/* eslint-disable consistent-return */
import React, { FC, useState } from 'react';
import { cloneDeep } from 'lodash';
import style from './DragNDrop.module.scss';
import 'flexboxgrid';

// let dragStartItem: Params;
let dragNode: EventTarget;
let dragStartItem: Params = { grpI: 99, itemI: 99 };
let dragNodeDelete: EventTarget;

type Props = {
  data: {
    title: string;
    items: string[];
  }[];
};
type Params = { grpI: number; itemI: number };

const DragNDrop: FC<Props> = ({ data }) => {
  const [list, setList] = useState(data);
  const [dragging, setDragging] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const dragStartHandler = (event: React.DragEvent<HTMLDivElement>, params: Params) => {
    console.log('started dragging item coordinate', params);
    dragStartItem = params;
    dragNode = event.target;

    dragNode.addEventListener('dragend', dragEndHandler);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const dragEndHandler = () => {
    console.log('dragEndhandler activated');
    dragDeleteHandler();
    dragNode.removeEventListener('dragend', dragEndHandler);
    dragStartItem = { grpI: 0, itemI: 0 };
    // @ts-ignore
    dragNode = undefined;
    // @ts-ignore
    dragNodeDelete = undefined;
    setDragging(false);
  };
  const setDeleteEvent = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('entered');
    dragNodeDelete = e.target;
  };

  const dragEnterHandler = (e: React.DragEvent<HTMLDivElement>, params: Params) => {
    console.log('entered new position', params);
    // @ts-ignore
    dragNodeDelete = undefined;
    const currentItem = dragStartItem;
    if (dragNode !== e.target) {
      // so vajadzetu precizak izprast!
      setList((oldList) => {
        const newList = cloneDeep(oldList);
        newList[params.grpI].items.splice(
          params.itemI,
          0,
          newList[currentItem.grpI].items.splice(currentItem.itemI, 1)[0]
        );
        dragStartItem = params;
        return newList;
      });
    }
  };
  const dragDeleteHandler = () => {
    const currentItem = dragStartItem;
    if (dragNodeDelete) {
      // setDragging(false);
      const newList = cloneDeep(list);
      newList[currentItem.grpI].items.splice(currentItem.itemI, 1);
      setList(newList);
    }
  };

  const getStyles = (params: Params) => {
    if (dragStartItem.grpI === params.grpI && dragStartItem.itemI === params.itemI) {
      return style.current;
    }
  };

  const handleNothing = () => {
    console.log('nothing to handle');
  };

  const dragGroupHandler = (e: React.DragEvent<HTMLDivElement>, params: Params) => {
    if (dragging && !list[params.grpI].items.length) {
      dragEnterHandler(e, params);
    }
  };

  const addNewNoteHandler = () => {
    if (inputValue) {
      const newList = cloneDeep(list);
      newList[0].items.push(inputValue);
      setList(newList);
      setInputValue('');
    } else {
      alert('add note'); 
    }
    setInputValue('');
  };

  return (
    <>
      <div className="row middle-xs">
        <div
          className="col-xs-11"
          onDragEnter={() => {
            // @ts-ignore
            dragNodeDelete = undefined;
          }}
        >
          <div className={style.addTaskWrapper}>
            <input
              type="text"
              className={style.input}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="button" className={style.button} onClick={() => addNewNoteHandler()}>
              Add note...
            </button>
          </div>
        </div>
        <div className="col-xs-1">
          <div className={style.ImageWrapper} onDragEnter={(e) => setDeleteEvent(e)}>
            <img
              src="https://st2.depositphotos.com/5266903/8456/v/600/depositphotos_84569362-stock-illustration-trash-can-flat-yellow-color.jpg"
              alt="trash"
              className={style.Image}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className={style.DragNDrop}>
          {list.map((grp, grpI) => (
            <div className="col-xs-4" key={grp.title}>
              <div
                className={style.dndGroup}
                onDragEnter={(e) => dragGroupHandler(e, { grpI, itemI: 0 })}
              >
                <div className={style.groupTitle}>{grp.title}</div>
                {grp.items.map((item, itemI) => (
                  <div
                    key={item}
                    className={`${style.dndItem} ${dragging && getStyles({ grpI, itemI })} ${
                      grpI === 1 && style.progress
                    } ${grpI === 2 && style.done}`}
                    onDragEnter={
                      dragging ? (e) => dragEnterHandler(e, { grpI, itemI }) : handleNothing
                    }
                    draggable
                    onDragStart={(event) => dragStartHandler(event, { grpI, itemI })}
                  >
                    <p className={style.paragraph}>
                      {itemI + 1}. {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DragNDrop;

import React from 'react';
import style from './App.module.scss';
import 'flexboxgrid';
import DragNDrop from './components/DragNDrop/DragnDrop';

const data = [
  { title: 'to do!', items: ['Nopērc pienu', 'uztaisi ēst', 'izpildi md'] },
  {
    title: 'in progress',
    items: ['sakārto istabu', 'salabo mašīnu', 'iemarinē gurķus', 'apēst zupu'],
  },
  { title: 'done', items: ['novākt ražu', 'papaijāt suni'] },
];

const App = () => {
  return (
    <div>
      <div className="container">
        <div className={style.header}>
          <DragNDrop data={data} />
        </div>
      </div>
    </div>
  );
};

export default App;

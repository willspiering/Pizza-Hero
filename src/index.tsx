import * as React from "react";
import { render } from "react-dom";

import "./styles.css";

// Pizza Utilities
//area of 1 pizza in sq.in
let areaOfPizza = diameter => {
  let radius = diameter / 2;
  let pi = 3.14;
  let area = pi * (radius * radius);
  return area;
};

//area of total pizza count
let totalPizzaArea = (size, numberOfPizzas) => {
  return areaOfPizza(size) * numberOfPizzas;
};
//price per sq inch
let pricePerSqIn = (unitPrice, totalPizzaArea, numberOfPizzas) => {
  return (unitPrice * numberOfPizzas) / totalPizzaArea;
};
//price per slice
let pricePerSlice = (unitPrice, slicesPerPizza) => {
  return unitPrice / slicesPerPizza;
};
// total cost
let totalPrice = (unitPrice, numberOfPizzas) => {
  return unitPrice * numberOfPizzas;
};

interface PizzaBuildState {
  id: string;
  size: number;
  unitPrice: number;
  numberOfPizzas: number;
  slices: number;
  areaOfPizza: number;
  totalArea: number;
  pricePerSqIn: number;
  pricePerSlice: number;
  totalPrice: number;
}

const DEFAULTSTATE: PizzaBuildState = {
  id: "",
  size: 0,
  unitPrice: 0,
  numberOfPizzas: 0,
  slices: 0,
  areaOfPizza: 0,
  totalArea: 0,
  pricePerSqIn: 0,
  pricePerSlice: 0,
  totalPrice: 0
};

function PizzaForm(props) {
  //const [pizzaState, setPizzaState] = React.useState(DEFAULTSTATE);
  const [pizzaBuild, setPizzaBuild] = React.useState(DEFAULTSTATE);
  const [pizzaSize, setPizzaSize] = React.useState(0);
  const [pizzaPrice, setPizzaPrice] = React.useState(0);
  const [pizzaQuantity, setPizzaQuantity] = React.useState(0);
  const [pizzaSlices, setPizzaSlices] = React.useState(0);

  const handleSize = e => {
    setPizzaSize(e);
  };

  const handlePrice = e => {
    setPizzaPrice(e);
  };

  const handleQuantity = e => {
    setPizzaQuantity(e);
  };

  const handleSlices = e => {
    setPizzaSlices(e);
  };

  function generateId() {
    return (
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  //resetForm

  const buildPizza = () => {
    setPizzaBuild({
      id: generateId(),
      size: pizzaSize,
      unitPrice: pizzaPrice,
      numberOfPizzas: pizzaQuantity,
      slices: pizzaSlices,
      areaOfPizza: areaOfPizza(pizzaSize),
      totalArea: totalPizzaArea(pizzaSize, pizzaQuantity),
      pricePerSqIn: pricePerSqIn(
        pizzaPrice,
        totalPizzaArea(pizzaSize, pizzaQuantity),
        pizzaQuantity
      ),
      pricePerSlice: pricePerSlice(pizzaPrice, pizzaSlices),
      totalPrice: totalPrice(pizzaPrice, pizzaQuantity)
    });
    props.updateList(pizzaBuild);
    console.log("Pizza Build: ", pizzaBuild);
  };

  return (
    <div>
      <div>
        <div>
          Price Per Sq. Inch:
          {pricePerSqIn(
            pizzaPrice,
            totalPizzaArea(pizzaSize, pizzaQuantity),
            pizzaQuantity
          )}
        </div>
        <div>Price Per Slice: {pricePerSlice(pizzaPrice, pizzaSlices)}</div>
        <div>Total Price: {totalPrice(pizzaPrice, pizzaQuantity)}</div>
        <div>Pizza Size: {pizzaSize}</div>
        <div>Unit Price: {pizzaPrice}</div>
        <div>Quantity: {pizzaQuantity}</div>
        <div>Slices per Pizza: {pizzaSlices}</div>
      </div>
      <label htmlFor="">Pizza Size: </label>
      <input
        type="text"
        value={pizzaSize}
        onChange={e => handleSize(e.target.value)}
      />
      <br />
      <label htmlFor="">Unit Price: </label>
      <input
        type="text"
        value={pizzaPrice}
        onChange={e => handlePrice(e.target.value)}
      />
      <br />
      <label htmlFor="">Number of Pizzas: </label>
      <input
        type="text"
        value={pizzaQuantity}
        onChange={e => handleQuantity(e.target.value)}
      />
      <br />
      <label htmlFor="">Slices per Pizza: </label>
      <input
        type="text"
        value={pizzaSlices}
        onChange={e => handleSlices(e.target.value)}
      />
      <br />
      <button onClick={buildPizza}>Build Pizza</button>
    </div>
  );
}

function ResultsList(props) {
  //have placeholder for empty list
  //order items by lowest price per sq in
  return (
    <ul>
      {props.list.map(item => {
        return (
          <li key={item.id}>
            <span>Price Per Sq. Inch: {item.pricePerSqIn}</span>
            <span>Price Per Slice: {item.pricePerSlice}</span>
            <span>Total Price: {item.totalPrice}</span>
            <span>Pizza Size: </span>
            <span>Unit Price: </span>
            <span>Quantity: </span>
            <span>Slices per Pizza: </span>
            <button onClick={() => props.removeBuild(item.id)}>X</button>
          </li>
        );
      })}
    </ul>
  );
}

function App() {
  const [pizzaList, setPizzaList] = React.useState([]);
  console.log("PizzaList: ", pizzaList);

  let addPizzaBuild = newPizzaBuild => {
    setPizzaList(pizzaList => pizzaList.concat(newPizzaBuild));
  };

  let removePizzaBuild = id => {
    setPizzaList(pizzaList => pizzaList.filter(t => t.id !== id));
  };
  return (
    <div className="App">
      <h1 onClick={() => console.log("PizzaList: ", pizzaList)}>Pizza Hero</h1>
      <h2>Compare pizza prices, get the most dough for your $dough$</h2>
      <PizzaForm updateList={addPizzaBuild} />
      <ResultsList list={pizzaList} removeBuild={removePizzaBuild} />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);

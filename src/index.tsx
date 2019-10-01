import * as React from "react";
import { render } from "react-dom";
import styled from "styled-components";

import "./styles.scss";

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
  return ((unitPrice * numberOfPizzas) / totalPizzaArea).toFixed(2);
};
//price per slice
let pricePerSlice = (unitPrice, slicesPerPizza) => {
  return (unitPrice / slicesPerPizza).toFixed(2);
};
// total cost
let totalPrice = (unitPrice, numberOfPizzas) => {
  return (unitPrice * numberOfPizzas).toFixed(2);
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
  size: 12,
  unitPrice: 0,
  numberOfPizzas: 1,
  slices: 6,
  areaOfPizza: 0,
  totalArea: 0,
  pricePerSqIn: 0,
  pricePerSlice: 0,
  totalPrice: 0
};

function PizzaForm(props) {
  //const [pizzaState, setPizzaState] = React.useState(DEFAULTSTATE);
  const [pizzaBuild, setPizzaBuild] = React.useState(DEFAULTSTATE);
  const [pizzaSize, setPizzaSize] = React.useState(18);
  const [pizzaPrice, setPizzaPrice] = React.useState(0);
  const [pizzaQuantity, setPizzaQuantity] = React.useState(1);
  const [pizzaSlices, setPizzaSlices] = React.useState(6);

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
    <div className="pizzaForm">
      <div className="currentBuild">
        <div className="stat">
          <span className="statLabel">Price Per Sq. Inch</span>
          <span className="statNumber">
            $
            {pricePerSqIn(
              pizzaPrice,
              totalPizzaArea(pizzaSize, pizzaQuantity),
              pizzaQuantity
            )}
          </span>
        </div>
        <div className="stat">
          <span className="statLabel">Price Per Slice</span>
          <span className="statNumber">
            ${pricePerSlice(pizzaPrice, pizzaSlices)}
          </span>
        </div>
        <div className="stat">
          <span className="statLabel">Total Price</span>
          <span className="statNumber">
            ${totalPrice(pizzaPrice, pizzaQuantity)}
          </span>
        </div>
        {console.log("Pizza Size: ", pizzaSize)
        /* <div>Pizza Size: {pizzaSize}</div>
        <div>Unit Price: {pizzaPrice}</div>
        <div>Quantity: {pizzaQuantity}</div>
        <div>Slices per Pizza: {pizzaSlices}</div> */
        }
      </div>
      <div className="inputSection">
        <label htmlFor="">Pizza Size: </label>
        <input
          type="range"
          value={pizzaSize}
          min={10}
          max={42}
          step={1}
          onChange={e => handleSize(e.target.value)}
        />

        <br />
        <label htmlFor="">Unit Price: </label>
        <input
          type="number"
          value={pizzaPrice}
          min={0}
          max={100}
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
    <StyledApp theme={theme}>
      <div>
        <h1 onClick={() => console.log("PizzaList: ", pizzaList)}>
          Pizza Hero
        </h1>
        <h2>Compare pizza prices, get the most dough for your $dough$</h2>
      </div>
      <section>
        <PizzaForm updateList={addPizzaBuild} />
        <ResultsList list={pizzaList} removeBuild={removePizzaBuild} />
      </section>
    </StyledApp>
  );
}

const theme = {
  black: "#171a21",
  nickel: "#617073",
  tertiary: "#68b684",
  secondary: "#337357",
  primary: "#db504a"
};

const StyledApp = styled.div`
  color: white;
  .pizzaForm {
    max-width: 375px;
    border-radius: 20px;
    overflow: hidden;
    background: ${theme.tertiary};
    color: ${theme.black};
  }
  .currentBuild {
    background: white;
    display: flex;
    padding: 0 15px;
    text-align: center;
    justify-content: space-evenly;
    align-items: center;
    height: 70px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    .stat {
      flex: 0 0 100px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .statLabel {
      font-size: 12px;
      width: 100%;
    }
    .statNumber {
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 24px;
      font-weight: bold;
      width: 100%;
    }
  }
  .inputSection {
    padding: 15px;
  }
`;

const rootElement = document.getElementById("root");
render(<App />, rootElement);

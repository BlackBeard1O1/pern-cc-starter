const Car = ({ name, model, year, price }) => {
    return (
        <li>
            <h2>Car Name: {name}</h2>
            <p>Car Model: {model}</p>
            <p>Year: {year}</p>
            <p>Car Price: ${price}</p>
        </li>
    );
};

export default Car;

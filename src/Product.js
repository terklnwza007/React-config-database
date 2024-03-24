import React, { useState, useEffect } from "react";
import axios from "axios";
import './pro_sty.css'; 

export default function Product() {
    
    const [product, setProduct] = useState([]);
    const myInputRef1 = React.createRef();
    const myInputRef2 = React.createRef();
    const myInputRef3 = React.createRef();

    
    useEffect(() => {
        console.log("request to api");
        axios.get("http://127.0.0.1:5000/products")
            .then(response => setProduct(response.data))
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    
    const onAddProduct = () => {
        const data = {
            name: myInputRef1.current.value,
            price: myInputRef2.current.value,
            image: myInputRef3.current.value,
        };
        const names = myInputRef1.current.value;
        const price = myInputRef2.current.value;
        const img = myInputRef3.current.value;
        if (names !== "" && price !== "" && img !== "") {
            axios.post("http://127.0.0.1:5000/products", data)
                .then(response => {
                    setProduct(response.data);
                });
            myInputRef1.current.value = "";
            myInputRef2.current.value = "";
            myInputRef3.current.value = "";
        }
    };

    const onDelete = (id) => {
        const confirmDelete = window.confirm("Delete ID : " + id);
        if (confirmDelete) {
            axios.delete("http://127.0.0.1:5000/products/" + id)
                .then(response => {
                    setProduct(response.data);
                    console.log(id);
                });
        }
    };

    const onUpdate = (id) => {
        const confirmUpdate = window.confirm("Replace ID : " + id);
        if (confirmUpdate) {
            const newData = {
                name: myInputRef1.current.value || product.find(item => item._id === id).name,
                price: myInputRef2.current.value || product.find(item => item._id === id).price,
                image: myInputRef3.current.value || product.find(item => item._id === id).image
            };
            const { name, price, image } = newData;
        
            if (name !== "" && price !== "" && image !== "") {
                axios.put("http://127.0.0.1:5000/products/" + id, newData)
                    .then(response => {
                        setProduct(response.data);
                    })
                    .catch(error => {
                        console.error('Error updating product:', error);
                    });
        
                myInputRef1.current.value = "";
                myInputRef2.current.value = "";
                myInputRef3.current.value = "";
            }
        }
    };

    const showProducts = product.map(item => (
        <tr key={item._id}>
            <td>{item._id}</td>
            <td><img src={item.image} alt={item.name} /></td>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>
                <button className="delete" onClick={() => onDelete(item._id)}>Delete</button>&nbsp;&nbsp;
                <button onClick={() => onUpdate(item._id)}>Replace</button>
            </td>
        </tr>
    ));

    return (
        <div>
            Product Name : <input type="text" name='product_name' ref={myInputRef1} /><br />
            Price : <input type="text" name='product_price' ref={myInputRef2} /><br />
            Link Image : <input type="text" name='product_img' ref={myInputRef3} /><br />
            <button onClick={onAddProduct}>Add</button>
            <table border='1'>
                <thead>
                    <tr>
                        <td>id</td>
                        <td>Image</td>
                        <td>Name</td>
                        <td>Price</td>
                        <td>Option</td> 
                    </tr>
                </thead>
                <tbody>{showProducts}</tbody>
            </table>
        </div>
    );
}

const dataApi = {
    getProducts: async () => {
        const res = await fetch('http://localhost:5000/product');
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        return data.product; 
    },
    getUsers: async() => {
        const res = await fetch('http://localhost:5000/product')
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json()
        return data.product
    }
};

export default dataApi;

import axios from "axios";

async function axTest() {
    try {
        const { data } = await axios.get("http://localhost:3000/countries");
        console.log(data.map(i => i.government));
    } catch (err) {
        console.error("Error:", err);
    }
}

axTest();

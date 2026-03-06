import axios from "axios";

async function axTest() {
    try {
        const { data } = await axios.get("http://localhost:3000/countries/id");
        console.log(data);
    } catch (err) {
        console.error("Error:", err);
    }
}

axTest();

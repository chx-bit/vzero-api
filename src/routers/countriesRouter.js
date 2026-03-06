import countries from "../api/countries.js";
import express from "express";

const countriesRouter = express.Router();

countriesRouter.get("/", (req, res) => {
    const { name, capital, region, language, currency } = req.query;

    let data;
    if (name) {
        data = countries.filter(c =>
            c.name.toLowerCase().includes(name.toLowerCase())
        );
    } else {
        data = countries.map(({ government, ...rest }) => rest);
    }
    
    if (capital)
        data = data.filter(c =>
            c.capital.toLowerCase().includes(capital.toLowerCase())
        );
    if (region)
        data = data.filter(c =>
            c.region.toLowerCase().includes(region.toLowerCase())
        );
    if (language)
        data = data.filter(c =>
            c.language.toLowerCase().includes(language.toLowerCase())
        );
    if (currency)
        data = data.filter(c =>
            c.currency.toLowerCase().includes(currency.toLowerCase())
        );

    if (!data || data.length === 0)
        return res.status(404).json({ error: "Country may not found" });

    res.json(data);
});

export { countriesRouter };

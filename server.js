const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://erickfernandocarvalhosanchez:orzntIdyDLDdzjwp@cluster0.1uz2ek4.mongodb.net/';
const client = new MongoClient(uri, { useUnifiedTopology: true })

async function createInDb(client, db = "", collection = "", data = []) {
    try {
        await client.connect();

        const res = await client.db(db).collection(collection).insertMany(data);

        return res;

    } catch (error) {
        console.log("Someting went wrong");
        console.log("--------------------------------------------------------------------------");
        console.log(error);
        console.log("--------------------------------------------------------------------------");
    } finally {
        client.close()
    }
}
async function readInDb(client, db = "", collection = "", data = {}) {
    try {
        await client.connect();

        const res = await client.db(db).collection(collection).findOne(data);

        return res;

    } catch (error) {
        console.log("Someting went wrong");
        console.log("--------------------------------------------------------------------------");
        console.log(error);
        console.log("--------------------------------------------------------------------------");
    } finally {
        client.close()
    }
}
async function updateInDb(client, db = "", collection = "", indentificator = {}, data = {}) {
    try {
        await client.connect();

        const res = await client.db(db).collection(collection).updateOne(indentificator, { $set: data });

        return res;

    } catch (error) {
        console.log("Someting went wrong");
        console.log("--------------------------------------------------------------------------");
        console.log(error);
        console.log("--------------------------------------------------------------------------");
    } finally {
        client.close()
    }
}
async function deleteInDb(client, db = "", collection = "", indentificator = {}) {
    try {
        await client.connect();

        const res = await client.db(db).collection(collection).deleteOne(indentificator);

        return res;

    } catch (error) {
        console.log("Someting went wrong");
        console.log("--------------------------------------------------------------------------");
        console.log(error);
        console.log("--------------------------------------------------------------------------");
    } finally {
        client.close()
    }
}

const app = express();

app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ limit: '100kb', extended: true }));

app.get("/", (req, res) => {
    res.render("main.hbs");
});

app.get("/logIn", (req, res) => {
    res.render("logIn.hbs");
});

app.get("/signIn", (req, res) => {
    res.render("signin.hbs");
});

app.post("/check", (req, res) => {
    data = readInDb(client, "apvProject", "Usuarios", { userName: req.body.username });
    data.then((a) => {
        if (!a) {
            stat = createInDb(client, "apvProject", "Usuarios", [

                {
                    name: req.body.name,
                    userName: req.body.username,
                    password: req.body.password,
                    state: "user",
                    role: req.body.role
                }
            ]);
            res.render("feed.hbs");
        } else {
            res.render("wrong.hbs",
                {
                    sign: true,
                    other: false,
                    log: false
                }
            );
        }
    });
});

app.post("/feed", (req, res) => {
    data = readInDb(client, "apvProject", "Usuarios", { userName: req.body.username });
    data.then((a) => {
        if (req.body.password == a.password && a != null) {
            res.render("feed.hbs");
        } else {
            res.render("wrong.hbs", {
                log: true,
                other: false
            });
        }
    });
});

app.get("/feed", (req, res) => {
    res.render("feed.hbs");
});

const server = app.listen(3000, () => {
    console.log("Running");
});
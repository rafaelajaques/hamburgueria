const express = require('express')
const uuid = require('uuid')
const cors = require('cors')

const app = express()
const port = 3001
app.use(express.json())
app.use(cors())

const orders = []

const checkId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(client =>
        client.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Client not founded" })
    }

    request.userIndex = index
    request.userId = id

    next()
}



app.post('/order', (request, response) => {
    const { order, name, price } = request.body
    let client = { id: uuid.v4(), order, name, price, status: "Em preparação" }

    orders.push(client)

    return response.status(201).json(client)
})

app.get('/order', (request, response) => {
    return response.json(orders)
})

app.put('/order/:id', checkId, (request, response) => {

    const { order, name, price } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateClient = { id, order, name, price }

    orders[index] = updateClient

    return response.json(updateClient)
})

app.delete('/order/:id', checkId, (request, response) => {

    const index = request.userIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', checkId, (request, response) => {

    const index = request.userIndex

    const client = orders[index]

    return response.json(client)
})

app.patch('/order/:id', checkId, (request, response) => {

    const index = request.userIndex

    let clientStatus = orders[index]
    clientStatus.status = "Pronto"

    return response.json(clientStatus)
})


app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})
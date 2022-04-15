const { response, request } = require('express');

const usersGet = (req = request, res = response) => {
    const { id } = req.query;
    res.json({
        msg: 'get API Controller',
        id
    })
}

const usersPost = (req, res = response) => {
    const { nombre, edad } = req.body;

    res.json({
        msg: 'post API Controller',
        nombre,
        edad
    })
}

const usersPut = (req, res = response) => {
    const id = req.params.id;

    res.json({
        msg: 'put API Controller',
        id
    })
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API Controller'
    })
}

const usersDelete = (req, res = response) => {
    res.json({
        msg: 'delete API Controller'
    })
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}
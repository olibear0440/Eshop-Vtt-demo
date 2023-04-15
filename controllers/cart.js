const CartModel = require("../models/Cart.js");
const VttModel = require("../models/Vtt.js");
const UserModel = require("../models/User");
const mongoose = require("mongoose");

exports.addToCart = (req, res, next) => {
  const { user, product, quantity, price } = req.body;
  if (!mongoose.Types.ObjectId.isValid(user)) {
    return res.status(400).json({ message: "utilisateur n'existe pas !" });
  }
  if (!mongoose.Types.ObjectId.isValid(product)) {
    return res.status(400).json({ message: "le produit n'existe pas" });
  }

  UserModel.findById(user)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      CartModel.findOne({ user: user })
        .then((cart) => {
          if (!cart) {
            cart = new CartModel({
              user: user,
              products: [],
              total: 0,
            });
          }

          let productExists = false;
          cart.products.forEach((foundProduct) => {
            if (foundProduct.product.equals(product)) {
              foundProduct.quantity += quantity ? parseInt(quantity) : 1;
              foundProduct.price = price;
              productExists = true;
            }
          });
          if (!productExists) {
            const newProduct = {
              product: product,
              quantity: quantity ? parseInt(quantity) : 1,
              price: price,
            };
            cart.products.push(newProduct);
          }
          cart.total = 0;
          cart.products.forEach((foundProduct) => {
            cart.total += foundProduct.price * foundProduct.quantity;
          });
          return cart.save();
        })

        .then((savedCart) => {
          res.json(savedCart);
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        })
        .catch((err) => res.status(500).json({ message: err.message }));
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.getCart = (req, res, next) => {
  CartModel.find()
    .then((cart) => res.status(200).json(cart))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.getOneCart = (req, res, next) => {
  CartModel.findOne({ _id: req.params.id })
    .then((cart) => res.status(200).json(cart))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.deleteProductCart = (req, res, next) => {
  const id = req.params.id;
  const productId = req.params.productId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "panier non valide" });
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "produit non valide" });
  }

  CartModel.findById(id)
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
      );

      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity--;
        cart.total -= cart.products[productIndex].price;
      } else {
        cart.products.splice(productIndex, 1);
      }

      return cart.save();
    })
    .then((savedCart) => {
      res.json(savedCart);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

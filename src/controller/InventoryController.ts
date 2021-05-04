import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Inventory } from '../entity/Inventory';

class ProductController {
  public static listAll = async (req: Request, res: Response) => {
    const inventoryRepo = getRepository(Inventory);
    const inventory = await inventoryRepo.find();

    res.send(inventory);
  };

  public static getOneById = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    const inventoryRepository = getRepository(Inventory);
    try {
      const product = await inventoryRepository.findOneOrFail(id);
      res.status(200).send(product);
    } catch (error) {
      console.log("error", error)
      res.status(404).send('Product not found');
    }
  };

  public static newProduct = async (req: Request, res: Response) => {
    const { name, quantity } = req.body;
    console.log("object")
    const product = new Inventory();
    product.name = name;
    product.quantity = quantity;


    // const errors = await validate(product);
    // if (errors.length > 0) {
    //   res.status(400).send(errors);
    //   return;
    // }


    const inventoryRepository = getRepository(Inventory);
    try {
      await inventoryRepository.save(product);
    } catch (e) {
      console.log("error", e)
      res.status(409).send(`ERROR_SAVING_PRODUCT_${e.message}`);
      return;
    }

    res.status(201).send('Product created');
  };

  public static editProduct = async (req: Request, res: Response) => {
    const id = req.params.id;

    const { name, quantity } = req.body;

    const inventoryRepository = getRepository(Inventory);
    let product;
    try {
      product = await inventoryRepository.findOneOrFail(id);
    } catch (error) {
      console.log("error", error)
      res.status(404).send('Product not found');
      return;
    }

    product.name = name;
    product.quantity = quantity;
    // const errors = await validate(product);
    // if (errors.length > 0) {
    //   res.status(400).send(errors);
    //   return;
    // }

    try {
      await inventoryRepository.save(product);
    } catch (e) {
      console.log("error", e)
      res.status(409).send('Error updating product');
      return;
    }
    res.status(204).send();
  };

  public static deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id;

    const inventoryRepository = getRepository(Inventory);
    try {
      await inventoryRepository.findOneOrFail(id);
      await inventoryRepository.delete(id);
    } catch (error) {
      console.log("error", error)
      res.status(404).send('Product not found');
      return;
    }

    res.status(204).send();
  };
}

export default ProductController;

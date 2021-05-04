import { Router } from 'express';
import InventoryController from '../controller/InventoryController';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

router.get('/', InventoryController.listAll);

router.get('/:id([0-9]+)', InventoryController.getOneById);

router.post('/', InventoryController.newProduct);
router.patch('/:id([0-9]+)', InventoryController.editProduct);

router.delete('/:id([0-9]+)', InventoryController.deleteProduct);

export default router;

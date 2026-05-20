import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/lead.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types';

const router = Router();

// Apply protect middleware to all routes in this router
router.use(protect);

// Order matters: /export/csv must come before /:id to prevent 'export' being treated as an id
router.get('/export/csv', exportLeadsCSV);

router.route('/')
  .post(createLead)
  .get(getLeads);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(authorize(UserRole.ADMIN), deleteLead);

export default router;

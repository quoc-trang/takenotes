import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all notes for authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single note
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new note
router.post('/', [
  authenticateToken,
  body('title').trim().isLength({ min: 1, max: 255 }),
  body('content').trim().isLength({ min: 1 }),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: req.user!.id,
      }
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update note
router.put('/:id', [
  authenticateToken,
  body('title').trim().isLength({ min: 1, max: 255 }),
  body('content').trim().isLength({ min: 1 }),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content } = req.body;

    const note = await prisma.note.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content }
    });

    res.json(updatedNote);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await prisma.note.delete({
      where: { id }
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 
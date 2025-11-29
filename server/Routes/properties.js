import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// GET todas las propiedades
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET propiedad por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST nueva propiedad (admin)
router.post('/', async (req, res) => {
  try {
    const { titulo, precio, ubicacion, descripcion, metros2, habitaciones, banos, imagenes } = req.body;

    const { data, error } = await supabase
      .from('propiedades')
      .insert([{
        titulo,
        precio,
        ubicacion,
        descripcion,
        metros2,
        habitaciones,
        banos,
        imagenes,
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar propiedad
router.put('/:id', async (req, res) => {
  try {
    const { titulo, precio, ubicacion, descripcion, metros2, habitaciones, banos, imagenes } = req.body;

    const { data, error } = await supabase
      .from('propiedades')
      .update({
        titulo,
        precio,
        ubicacion,
        descripcion,
        metros2,
        habitaciones,
        banos,
        imagenes,
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE propiedad
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('propiedades')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Propiedad eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
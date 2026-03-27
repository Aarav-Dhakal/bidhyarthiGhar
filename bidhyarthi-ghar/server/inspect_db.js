const pool = require('./db');

async function inspectSchema() {
  try {
    console.log('--- Inspecting ALL constraints on rooms table ---');
    const res = await pool.query(`
      SELECT conname, pg_get_constraintdef(c.oid) as def
      FROM pg_constraint c
      JOIN pg_class t ON t.oid = c.conrelid
      WHERE t.relname = 'rooms';
    `);
    res.rows.forEach(row => {
      console.log(`Constraint: ${row.conname}`);
      console.log(`Definition: ${row.def}`);
    });
  } catch (err) {
    console.error('Inspection failed:', err);
  } finally {
    process.exit();
  }
}

inspectSchema();

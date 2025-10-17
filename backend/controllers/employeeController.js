const User = require("../models/User");

// GET /api/employees?q=shirly
async function listEmployees(req, res) {
  try {
    const { q } = req.query;
    const filter = { role: "empleado", isActive: true };
    if (q) filter.name = new RegExp(q, "i");

    const employees = await User.find(filter)
      .select("_id name email phone profileImage");

    res.json({ ok: true, employees });
  } catch (error) {
    console.error("listEmployees error:", error);
    res.status(500).json({ ok: false, message: "Error al listar empleados" });
  }
}

module.exports = { listEmployees };
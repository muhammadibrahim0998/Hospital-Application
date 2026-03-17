
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import labRoutes from './routes/labRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/messages", messageRoutes);

function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}

function split(thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash || thing.fast_star) {
    return ''
  } else {
    var b = thing.toString().replace('\\/?', '').replace('(?=\\/|$)', '').match(/^\/\^((?:\\[.*+?^${}()|[\]\\]|[^\/*+?^${}()|[\]\\])*)\$\//)
    return b ? b[1].replace(/\\(.)/g, '$1').split('/') : '<complex:' + thing.toString() + '>'
  }
}

app._router.stack.forEach(print.bind(null, []))

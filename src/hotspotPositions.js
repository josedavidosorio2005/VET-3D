/**
 * Calibrated 2-D hotspot positions for each anatomical system image.
 *
 * Coordinates are expressed as { x, y } percentages of the image width/height,
 * measured from the top-left corner of the atlas image.
 *
 * Each image has the dog in a LEFT-FACING side view (head to the LEFT,
 * tail to the RIGHT of the frame), filling most of the canvas.
 *
 * Calibrated by visual inspection of the AI-generated atlas images.
 */

export const POSITIONS_2D = {

  // ─── Sistema Osteológico (atlas_skeleton.png) ───────────────────────────────
  // Dog: head left ~20%, tail right ~85%; body top ~15%, paws bottom ~88%
  skeletal: {
    'skull':              { x: 24, y: 26 },
    'mandible':           { x: 20, y: 37 },
    'teeth':              { x: 17, y: 40 },
    'cervical':           { x: 33, y: 28 },
    'thoracic-vertebrae': { x: 52, y: 22 },
    'lumbar':             { x: 65, y: 24 },
    'sacrum':             { x: 74, y: 30 },
    'caudal':             { x: 83, y: 36 },
    'ribs':               { x: 50, y: 40 },
    'sternum':            { x: 48, y: 56 },
    'scapula':            { x: 40, y: 28 },
    'humerus':            { x: 37, y: 46 },
    'radius-ulna':        { x: 36, y: 62 },
    'carpus':             { x: 35, y: 74 },
    'metacarpals':        { x: 34, y: 84 },
    'pelvis':             { x: 72, y: 37 },
    'femur':              { x: 73, y: 54 },
    'patella':            { x: 71, y: 67 },
    'tibia-fibula':       { x: 72, y: 76 },
    'tarsus':             { x: 74, y: 86 },
  },

  // ─── Sistema Miológico (atlas_muscles.png) ──────────────────────────────────
  // Same pose as skeleton; muscle labels visible in screenshot
  muscular: {
    'masseter':           { x: 18, y: 38 },
    'temporalis':         { x: 20, y: 26 },
    'brachiocephalicus':  { x: 30, y: 34 },
    'trapezius':          { x: 38, y: 26 },   // "trapezius" label visible upper back
    'deltoid':            { x: 37, y: 40 },   // "deltoideus" label
    'triceps':            { x: 38, y: 52 },   // "triceps brachii"
    'pectorals':          { x: 42, y: 58 },
    'latissimus':         { x: 55, y: 38 },
    'intercostals':       { x: 52, y: 48 },
    'abdominals':         { x: 60, y: 58 },   // "adductor semimembranosus" area
    'gluteals':           { x: 74, y: 32 },
    'quadriceps':         { x: 72, y: 50 },
    'hamstrings':         { x: 72, y: 44 },   // "infraspinatus" + back group
    'gastrocnemius':      { x: 72, y: 70 },
  },

  // ─── Sistema Nervioso (atlas_shepherd.png) ──────────────────────────────────
  // Real shepherd dog photo; head on LEFT side
  nervous: {
    'brain':              { x: 22, y: 22 },
    'cerebellum':         { x: 26, y: 28 },
    'spinal-cord':        { x: 52, y: 24 },
    'brachial-plexus':    { x: 40, y: 46 },
    'radial-nerve':       { x: 38, y: 58 },
    'median-ulnar':       { x: 37, y: 68 },
    'lumbosacral-plexus': { x: 68, y: 40 },
    'sciatic':            { x: 70, y: 55 },
    'femoral-nerve':      { x: 68, y: 52 },
    'facial-nerve':       { x: 18, y: 36 },
  },

  // ─── Arterias, venas y pulmones (atlas_cardio.png) ─────────────────────────
  // X-ray style; labels "Carotid arteries", "Jugular veins", "Aorta",
  // "Descending aorta", "Vena Cava", "Femoral arteries", "Femoral veins"
  // visible in screenshot
  cardio: {
    'heart':              { x: 47, y: 50 },
    'lungs':              { x: 50, y: 42 },
    'trachea':            { x: 38, y: 34 },
    'aorta':              { x: 50, y: 32 },   // "Aorta" label visible
    'pulmonary-artery':   { x: 46, y: 46 },
    'pulmonary-veins':    { x: 48, y: 52 },
    'cranial-cava':       { x: 42, y: 42 },
    'caudal-cava':        { x: 55, y: 40 },   // "Vena Cava (both caudal)"
    'jugular-vein':       { x: 30, y: 32 },   // "Jugular veins" label
    'carotid':            { x: 28, y: 27 },   // "Carotid arteries" label
    'subclavian-axillary':{ x: 38, y: 44 },
    'cephalic-vein':      { x: 36, y: 68 },
    'femoral-vessels':    { x: 56, y: 60 },   // "Femoral arteries"
    'saphenous-veins':    { x: 60, y: 72 },   // "Femoral veins"
    'portal-vein':        { x: 52, y: 56 },
  },

  // ─── Órganos internos (atlas_organs.png) ────────────────────────────────────
  // Dissection view; head left, organs in torso center
  digestive: {
    'esophagus':          { x: 33, y: 36 },
    'stomach':            { x: 45, y: 54 },
    'liver':              { x: 40, y: 46 },
    'gallbladder':        { x: 42, y: 52 },
    'pancreas':           { x: 46, y: 58 },
    'spleen':             { x: 50, y: 52 },
    'duodenum':           { x: 50, y: 58 },
    'jejunum-ileum':      { x: 56, y: 56 },
    'colon':              { x: 62, y: 52 },
    'kidneys':            { x: 54, y: 44 },
    'bladder':            { x: 68, y: 58 },
    'rectum-anus':        { x: 76, y: 52 },
  },

  // ─── Vista Clínica (atlas_shepherd.png) ─────────────────────────────────────
  clinical: {
    'eyes':               { x: 16, y: 30 },
    'ears':               { x: 20, y: 18 },
    'oral-mucosa':        { x: 13, y: 40 },
    'submandibular-ln':   { x: 22, y: 42 },
    'prescapular-ln':     { x: 38, y: 40 },
    'axillary-ln':        { x: 42, y: 52 },
    'inguinal-ln':        { x: 68, y: 52 },
    'popliteal-ln':       { x: 70, y: 65 },
    'vitals':             { x: 50, y: 46 },
    'skin-coat':          { x: 52, y: 32 },
  },
}

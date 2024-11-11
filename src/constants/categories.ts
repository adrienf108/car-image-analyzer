export const CATEGORIES = {
  'Exterior': [
    'front_left_angle_exterior_view',
    'left_side_exterior_view',
    'rear_left_angle_exterior_view',
    'rear_exterior_view',
    'rear_right_angle_exterior_view',
    'right_exterior_view',
    'front_left_exterior_view',
    'front_view',
    'details',
    'defects'
  ],
  'Inside': [
    'full_interior',
    'dashboard',
    'front_seats',
    'driver_seat',
    'rear_seats',
    'steering_wheel',
    'gear_shifter',
    'pedals_and_mats',
    'gauges',
    'details',
    'trunk'
  ],
  'Engine': [
    'full_engine',
    'engine_details'
  ],
  'Undercarriage': [
    'default'
  ],
  'Documents': [
    'invoices',
    'car_book',
    'technical_checks'
  ],
  'Uncategorized': [
    'default'
  ]
};

export const OLLAMA_MODELS = [
  { id: 'llava', name: 'Llava', description: 'Best for general image classification' },
  { id: 'bakllava', name: 'BakLlava', description: 'Optimized for M1/M2 Macs' }
];

export const DEFAULT_SIMILARITY_THRESHOLD = 90;
export const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
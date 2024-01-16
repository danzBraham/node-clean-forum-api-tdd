/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn(
    'comments',
    {
      is_deleted: {
        type: 'BOOLEAN',
        notNull: true,
        default: 'false',
      },
    },
    { ifNotExists: true },
  );
};

exports.down = (pgm) => {
  pgm.dropColumn('comments', 'is_deleted');
};

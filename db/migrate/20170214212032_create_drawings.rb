class CreateDrawings < ActiveRecord::Migration[5.0]
  def change
    create_table :drawings do |t|
      t.string :name
      t.text :leds, array: true, default: []
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end

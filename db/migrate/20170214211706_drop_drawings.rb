class DropDrawings < ActiveRecord::Migration[5.0]
  def change
    drop_table :drawings
  end
end

class AddFeaturedToDrawings < ActiveRecord::Migration[5.0]
  def change
    add_column :drawings, :featured, :boolean
  end
end

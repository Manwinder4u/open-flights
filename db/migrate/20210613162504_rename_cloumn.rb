class RenameCloumn < ActiveRecord::Migration[6.0]
  def change
    rename_column :reviews, :decription, :description
  end
end

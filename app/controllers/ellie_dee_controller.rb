class EllieDeeController < ApplicationController

  def index
    @drawing = Drawing.find_by_name("EllieDee")
    @drawings = Drawing.all
  end

end

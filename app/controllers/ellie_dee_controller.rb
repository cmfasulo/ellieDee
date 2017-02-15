class EllieDeeController < ApplicationController

  def index
    @drawings = Drawing.all
  end

end

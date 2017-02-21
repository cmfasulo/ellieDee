class EllieDeeController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource

  def index
    @drawing = Drawing.find_by_name("EllieDee")
    @drawings = Drawing.all
  end

end

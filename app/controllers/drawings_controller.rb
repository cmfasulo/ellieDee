class DrawingsController < ApplicationController
  before_action :set_drawing, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, except: [:featured, :submissions, :elliedee]
  load_and_authorize_resource except: [:featured, :submissions, :elliedee]

  # GET /drawings
  # GET /drawings.json
  def index
    @drawings = Drawing.all
  end

  # GET /drawings/1
  # GET /drawings/1.json
  def show
  end

  # GET /drawings/new
  def new
    @drawing = Drawing.new
  end

  # GET /drawings/1/edit
  def edit
  end

  # POST /drawings
  # POST /drawings.json
  def create
    @drawing = Drawing.new(drawing_params)

    respond_to do |format|
      if @drawing.save
        format.html { redirect_to @drawing, notice: 'Drawing was successfully created.' }
        format.json { render :show, status: :created, location: @drawing }
      else
        format.html { render :new }
        format.json { render json: @drawing.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /drawings/1
  # PATCH/PUT /drawings/1.json
  def update
    respond_to do |format|
      if @drawing.update(drawing_params)
        format.html { redirect_to @drawing, notice: 'Drawing was successfully updated.' }
        format.json { render :show, status: :ok, location: @drawing }
      else
        format.html { render :edit }
        format.json { render json: @drawing.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /drawings/1
  # DELETE /drawings/1.json
  def destroy
    @drawing.destroy
    respond_to do |format|
      format.html { redirect_to :back, notice: 'Drawing was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def featured
    render :text => "Coming Soon!", :layout => true
  end

  def submissions
    render :text => "Coming Soon!", :layout => true
  end

  def elliedee
    @elliedee = Drawing.find_by_name('EllieDee')
    render json: @elliedee.leds
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_drawing
      @drawing = Drawing.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def drawing_params
      params.require(:drawing).permit(:name, :leds, :user_id, :leds => [])
    end
end

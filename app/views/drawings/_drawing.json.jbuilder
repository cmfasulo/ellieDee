json.extract! drawing, :id, :name, :leds, :user_id, :created_at, :updated_at
json.url drawing_url(drawing, format: :json)

class Drawing < ApplicationRecord
  belongs_to :user
  validates_uniqueness_of :name, scope: :user_id
  # validates_exclusion_of :name, in: %w[EllieDee]

  resourcify
end

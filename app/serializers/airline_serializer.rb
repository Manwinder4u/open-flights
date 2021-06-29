class AirlineSerializer
  include JSONAPI::Serializer
  attributes :name, :image_url, :slug, :average_score

  has_many :reviews
end

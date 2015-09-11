defmodule HarpsichordWeb.ClimateDatum do
  use HarpsichordWeb.Web, :model

  import Ecto.Query, only: [from: 2]

  schema "climate_data" do
    field :temperature, :float
    field :humidity, :float

    timestamps
  end

  @required_fields ~w(temperature humidity)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def latest do
    from d in HarpsichordWeb.ClimateDatum,
    order_by: [desc: d.inserted_at],
    limit: 1
  end
end

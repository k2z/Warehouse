using Warehouse.Server.Model.Entities;

namespace Warehouse.Server.Model.DataTransferObjects
{
    public class ShipmentResource: IDocumentItem
    {
        public int? Id { get; set; }
        public double? Count { get; set; }
        public string? Resource { get; set; }
        public int? ResourceId { get; set; }
        public string? Measure { get; set; }
        public int? MeasureId { get; set; }
    }

    public class Shipment
    {
        public int? Id { get; set; }
        public string? Number { get; set; }
        public DateOnly? Date { get; set; }
        public ShipmentState? State { get; set; }
        public int? ClientId { get; set; }
        public string? Client { get; set; }
        public IEnumerable<ShipmentResource>? Items { get; set; }

        public static Shipment FromEntity(Model.Entities.Shipment source)
        {
            var result = new Shipment
            {
                Id = source.Id,
                Number = source.Number,
                Date = source.Date,
                ClientId = source.ClientId,
                Client = source.Client.Name,
                State = source.State,
                Items = source.ShipmentResources.Select((ir) => new ShipmentResource
                {
                    Id = ir.Id,
                    Count = ir.Count,
                    Measure = ir.Measure.Name,
                    MeasureId = ir.MeasureId,
                    Resource = ir.Resource.Name,
                    ResourceId = ir.ResourceId
                }).ToList()
            };
            return result;
        }
    }
}

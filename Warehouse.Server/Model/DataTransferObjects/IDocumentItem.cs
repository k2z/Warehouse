namespace Warehouse.Server.Model.DataTransferObjects
{
    public interface IDocumentItem
    {
        public int? Id { get; set; }
        public double? Count { get; set; }
        public string? Resource { get; set; }
        public int? ResourceId { get; set; }
        public string? Measure { get; set; }
        public int? MeasureId { get; set; }
    }
}

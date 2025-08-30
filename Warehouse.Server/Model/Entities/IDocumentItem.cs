namespace Warehouse.Server.Model.Entities
{
    public interface IDocumentItem
    {
        public int Id { get; set; }
        public double Count { get; set; }
        public int ResourceId { get; set; }
        public Resource Resource { get; set; }
        public int MeasureId { get; set; }
        public Measure Measure { get; set; }
    }
}

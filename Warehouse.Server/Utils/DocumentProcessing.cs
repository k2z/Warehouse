using Microsoft.EntityFrameworkCore;
using Warehouse.Server.Model.Entities;

namespace Warehouse.Server.Utils
{
    public struct ResourceChange
    {
        public int ResourceId { get; set; }
        public int MeasureId { get; set; }
        public double Change { get; set; }
    }
    
    public static class DocumentProcessing
    {
        public static IEnumerable<ResourceChange> ApplyChanges<TEntity, TDataTransfer>(ICollection<TEntity> dbItems, IEnumerable<TDataTransfer> updateItems, DbSet<Measure> dbMeasures, DbSet<Resource> dbResources)
            where TEntity : Warehouse.Server.Model.Entities.IDocumentItem, new()
            where TDataTransfer : Warehouse.Server.Model.DataTransferObjects.IDocumentItem
        {
            var result = new List<ResourceChange>();
            
            var itemsToRemove = dbItems
                .Where(i => updateItems.All(ui => ui.Id != i.Id))
                .ToList();
            foreach (var removingItem in itemsToRemove)
            {
                dbItems.Remove(removingItem);
                result.Add(new ResourceChange(){ Change = -removingItem.Count, ResourceId = removingItem.ResourceId,  MeasureId = removingItem.MeasureId });
            }
            foreach (var updatingItemDto in updateItems)
            {
                var existingEntity = dbItems.FirstOrDefault(i => i.Id == updatingItemDto.Id);
                if (existingEntity == null)
                {
                    var newEntityItem = new TEntity
                    {
                        Count = updatingItemDto.Count!.Value,
                        MeasureId = updatingItemDto.MeasureId!.Value,
                        Measure = dbMeasures.Single(m => m.Id == updatingItemDto.MeasureId!.Value),
                        ResourceId = updatingItemDto.ResourceId!.Value,
                        Resource = dbResources.Single(r => r.Id == updatingItemDto.ResourceId!.Value),
                    };
                    dbItems.Add(newEntityItem);
                    result.Add(new ResourceChange(){ Change = newEntityItem.Count, ResourceId = newEntityItem.ResourceId,  MeasureId = newEntityItem.MeasureId });
                    continue;
                }
                result.Add(new ResourceChange(){ Change = updatingItemDto.Count!.Value - existingEntity.Count, ResourceId = existingEntity.ResourceId,  MeasureId = existingEntity.MeasureId });
                existingEntity.Count = updatingItemDto.Count!.Value;
                // Do not change types, create a new row instead.
                // if (existingEntity.ResourceId != updatingItemDto.ResourceId)
                // {
                //     existingEntity.ResourceId = updatingItemDto.ResourceId!.Value;
                //     existingEntity.Resource = dbResources.Single(r => r.Id == updatingItemDto.ResourceId!.Value);
                // }
                // if (existingEntity.MeasureId != updatingItemDto.MeasureId)
                // {
                //     existingEntity.MeasureId = updatingItemDto.MeasureId!.Value;
                //     existingEntity.Measure = dbMeasures.Single(r => r.Id == updatingItemDto.MeasureId!.Value);
                // }
            }
            return result;
        }

        public static async Task ApplyChangesToBalances(IEnumerable<ResourceChange> changes, DbSet<Balance> dbBalances)
        {
            foreach (var change in changes)
            {
                var balanceEntity = await dbBalances.SingleOrDefaultAsync(b => b.ResourceId == change.ResourceId && b.MeasureId == change.MeasureId);
                if (balanceEntity == null)
                {
                    var newEntity = new Balance()
                    {
                        ResourceId = change.ResourceId,
                        MeasureId = change.MeasureId,
                        Count = change.Change,
                    };
                    dbBalances.Add(newEntity);
                    continue;
                }
                balanceEntity.Count = balanceEntity.Count + change.Change;
            }
        }
    }
}

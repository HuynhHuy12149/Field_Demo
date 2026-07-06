using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FieldServiceAPI.Entities
{
    public class District : BaseEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        public string Name { get; set; } = default!;

        // Khóa ngoại nối sang bảng Province
        public int ProvinceId { get; set; }
        
        [ForeignKey("ProvinceId")]
        public Province Province { get; set; } = default!;
    }
}

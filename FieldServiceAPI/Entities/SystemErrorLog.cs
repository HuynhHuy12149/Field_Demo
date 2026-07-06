using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FieldServiceAPI.Entities
{
    public class SystemErrorLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? ErrorMessage { get; set; }
        public string? StackTrace { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

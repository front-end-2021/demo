using System;

namespace App.Models {
    // Partial class split across files & Attribute test
    public partial class User {
        [Obsolete("Dùng SaveV2")]
        public void Save() {
            Console.WriteLine("Saving...");
        }
    }
}
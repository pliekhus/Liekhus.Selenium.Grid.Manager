using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Liekhus.Selenium.Grid.Manager.Engine
{
    public class EngineSettings
    {
        public static EngineSettings LoadFromConfig()
        {
            return new EngineSettings();
        }

        public EngineSettings()
        {
            HubPort = 4444;
            NodeStartPort = 5567;
            MaxNodes = 4;
        }

        public int HubPort { get; set; }
        public int NodeStartPort { get; set; }
        public int MaxNodes { get; set; }

    }
}

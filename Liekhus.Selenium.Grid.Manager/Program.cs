using Liekhus.Selenium.Grid.Manager.Engine;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Liekhus.Selenium.Grid.Manager
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to the Selenium Grid Manager!");

            EngineContext.MessageReceived += EngineContext_MessageReceived;
            EngineContext.Initialize(new EngineSettings());

            Console.WriteLine("Press any key to close the hub and nodes...");
            Console.ReadKey();

            EngineContext.Shutdown();
        }

        private static void EngineContext_MessageReceived(object sender, string e)
        {
            Console.WriteLine(e);
        }
    }
}

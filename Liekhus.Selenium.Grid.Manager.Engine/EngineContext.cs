using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;

namespace Liekhus.Selenium.Grid.Manager.Engine
{
    public static class EngineContext
    {
        private static Process _hub = null;
        private static IList<Process> _nodes = new List<Process>();

        public static event EventHandler<string> MessageReceived;

        public static void OnMessageReceived(string e)
        {
            EventHandler<string> handler = MessageReceived;
            if (handler != null)
            {
                handler(typeof(EngineContext), e);
            }
        }
        public static void Initialize(EngineSettings settings)
        {
            if(_hub != null || _nodes.Count() > 0) { Shutdown(); }

            OnMessageReceived("Starting hub...");
            _hub = LaunchProcess("java", string.Format("-jar jars/selenium-server-standalone-3.9.1.jar -role hub -port {0}", settings.HubPort));
            Thread.Sleep(2500);
            OnMessageReceived("Hub started!");

            for (int n = 0; n < settings.MaxNodes; n++)
            {
                OnMessageReceived(string.Format("Starting node {0}...", n + 1));
                int port = settings.NodeStartPort + n;
                _nodes.Add(LaunchProcess("java", string.Format("-jar jars/selenium-server-standalone-3.9.1.jar -role node -hub http://localhost:{1}/grid/register -port {0}", port, settings.HubPort)));
                OnMessageReceived(string.Format("Node {0} started on port {1}", n + 1, port));
            }

        }

        public static void Shutdown()
        {
            _nodes.ToList().ForEach(node => {
                try
                {
                    node.CloseMainWindow();
                    node.Close();
                } 
                catch { }
            });

            try
            {
                _hub.CloseMainWindow();
                _hub.Close();
            }
            catch { }
        }

        private static Process LaunchProcess(string command, string arguments)
        {
            Process process = new Process();
            ProcessStartInfo info = new ProcessStartInfo(command, arguments);
            info.UseShellExecute = false; //false
            info.CreateNoWindow = true; //true
            info.RedirectStandardOutput = true;
            info.WorkingDirectory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

            process.StartInfo = info;
            process.EnableRaisingEvents = true;
            process.OutputDataReceived += Process_OutputDataReceived;
            process.Start();
            process.BeginOutputReadLine();
            //process.WaitForExit();
            return process;
        }

        private static void Process_OutputDataReceived(object sender, DataReceivedEventArgs e)
        {
            OnMessageReceived(e.Data);
        }
    }
}

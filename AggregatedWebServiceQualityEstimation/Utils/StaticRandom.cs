using System;
using System.Threading;

namespace AggregatedWebServiceQualityEstimation.Utils
{
    public class StaticRandom
    {
        private static int _seed;

        private static ThreadLocal<Random> threadLocal = new ThreadLocal<Random>
            (() => new Random(Interlocked.Increment(ref _seed)));

        static StaticRandom() => _seed = Environment.TickCount;

        public static Random Instance => threadLocal.Value;
    }
}
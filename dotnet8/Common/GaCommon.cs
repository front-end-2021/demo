namespace Web.Api.Common
{
    public static class ExtGoalAction
    {
        public static List<long> IdsToList(this string ids)
        {
            if (string.IsNullOrEmpty(ids)) return [];
            var lstId = ids.Split(",").Where(txtId => txtId.Length > 0);
            return lstId.Select(tId => (long)Convert.ToDouble(tId)).ToList();
        }
        public static string ListToTxt(this List<long> lstId)
        {
            if (lstId == null) return string.Empty;
            return string.Join(",", lstId);
        }
    }
}

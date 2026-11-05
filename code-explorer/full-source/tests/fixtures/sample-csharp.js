// Mã C# mẫu cho tab Diagrams (dựa trên sơ đồ ví dụ: Account/Contact, Beverage decorator, Animal/Duck)
export const SAMPLE_CSHARP = `using System;
using System.Collections.Generic;

namespace Demo
{
    // ---------- Account ----------
    public class Account
    {
        protected string name;
        protected string emailAddress;

        public string GetName() { return name; }
        public void SetName(string n, int t) { name = n; }
        public string GetEmailAddress() { return emailAddress; }
        public void SetEmailAddress(string e) { emailAddress = e; }
    }

    public class Contact : Account
    {
        private string faxNumber;

        public int GetFaxNumber() { return 0; }
        public void SetFaxNumber(int f) { }
    }

    // ---------- Beverage (Decorator) ----------
    public enum Size { VENTI, GRANDE, TALL }

    public abstract class Beverage
    {
        protected string description;
        protected Size size;

        public abstract List<string> GetDescription();
        public abstract double Cost();
        public Size GetSize() { return size; }
        public void SetSize(Size s) { size = s; }
    }

    public class HouseBlend : Beverage
    {
        public HouseBlend() { description = "House Blend"; }
        public override double Cost() { return 0.89; }
        public override List<string> GetDescription() { return new List<string> { description }; }
    }

    public class Espresso : Beverage
    {
        public Espresso() { description = "Espresso"; }
        public override double Cost() { return 1.99; }
        public override List<string> GetDescription() { return new List<string> { description }; }
    }

    public class DarkRoast : Beverage
    {
        public DarkRoast() { description = "Dark Roast"; }
        public override double Cost() { return 0.99; }
        public override List<string> GetDescription() { return new List<string> { description }; }
    }

    public class Decaf : Beverage
    {
        public Decaf() { description = "Decaf"; }
        public override double Cost() { return 1.05; }
        public override List<string> GetDescription() { return new List<string> { description }; }
    }

    public abstract class CondimentDecorator : Beverage
    {
        protected Beverage beverage;

        public abstract List<string> CountDes(string des);
    }

    public class Soy : CondimentDecorator
    {
        public Soy(Beverage b) { beverage = b; }
        public override double Cost() { return beverage.Cost() + 0.15; }
        public override List<string> GetDescription() { return beverage.GetDescription(); }
        public override List<string> CountDes(string des) { return new List<string>(); }
    }

    // ---------- Animal ----------
    public interface IQuack
    {
        void Quack();
    }

    public interface IFly
    {
        void Fly();
    }

    public class Animal
    {
        public int age;
        public string gender;

        public bool IsMammal() { return true; }
        public int Mate() { return 0; }
    }

    public class Zebra : Animal
    {
        public string isWild;

        public void Run() { }
    }

    public class Duck : Animal, IFly, IQuack
    {
        public string beakColor;
        public Zebra z;

        public void Swim(Zebra z) { }
        public void Fly() { }
        public void Quack() { }
    }
}
`
